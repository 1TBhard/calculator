const buttons = Array.from(document.getElementsByTagName("button"));
const calculatorExp = document.getElementsByClassName(
	"calculator_display_expression"
)[0];
const calculatorInput = document.getElementsByClassName(
	"calculator_display_input"
)[0];

const keys = Array.from(document.getElementsByClassName("key"));

var expStr = "";
var inputStr = "";
var isEnd = false; // "=" 이가 전단계에서 입력되었는지

// 괄호 체크
function checkBracket(str) {
	let stack = [];
	let arr = str.split("");

	arr.forEach((i) => {
		if (i == ")" && stack == []) return false;
		else if (i == "(") stack.push("(");
		else if (i == ")") stack.pop();
	});

	if (stack.length != 0) return false;
	else return true;
}

// 에러 발생시 버튼 전부 얼리기(클릭 못함)
function freezeButton() {
	buttons.map((btn) => {
		if (btn.value != "clear") btn.disabled = true;
	});
}

function meltButton() {
	buttons.map((btn) => {
		btn.disabled = false;
	});
}

buttons.map((btn) =>
	btn.addEventListener("click", () => {
		const pressText = btn.value.toString();

		if (pressText == "=") {
			if (isEnd) {
				return false;
			}
			// 괄호 안맞는 경우
			if (!checkBracket(expStr + inputStr)) {
				freezeButton();

				calculatorExp.innerHTML = `${expStr + inputStr}=`;
				calculatorInput.innerHTML = "Bracket ERROR";

				return false;
			}

			let finalExp = expStr + inputStr;

			// "숫자(숫자", "숫자)숫자" 에서 묵시적으로 * 삽입
			finalExp = finalExp.replace(/(\d)(\(\d)/gi, "$1*$2");
			finalExp = finalExp.replace(/(\d\))(\d)/gi, "$1*$2");

			const result = eval(finalExp).toString();

			calculatorInput.innerHTML =
				result.length > 17 ? "..." + result.slice(result.length - 17) : result;
			calculatorExp.innerHTML = `${
				finalExp.length > 27
					? "..." + finalExp.slice(finalExp.length - 27)
					: finalExp
			}=`;

			expStr = result.toString();
			inputStr = "";
			isEnd = true;
		} else {
			switch (pressText) {
				case "clear":
					expStr = "";
					inputStr = "";
					meltButton();
					break;

				case "backspace":
					inputStr = inputStr.substr(0, inputStr.length - 1);

					// <<, >>을 지우는 경우
					if (inputStr == "<" || ">")
						inputStr = inputStr.substr(0, inputStr.length - 1);
					break;

				case "+":
				case "-":
				case "*":
				case "/":
				case "%":
				case "<<":
				case ">>":
				case "(":
				case ")":
					expStr += inputStr + pressText;
					inputStr = "";
					break;

				default:
					if (isEnd) {
						expStr = "";
					}
					// 전 단계에서 = 눌러 결과 나온뒤 바로 숫자 누르면 결과 초기화
					inputStr += pressText;
			}
			isEnd = false;

			calculatorInput.innerHTML =
				inputStr.length > 17
					? "..." + inputStr.slice(inputStr.length - 17)
					: inputStr;
			calculatorExp.innerHTML =
				expStr.length > 25 ? "..." + expStr.slice(expStr.length - 23) : expStr;
		}
	})
);

// 키 누르는 것 이벤트
window.addEventListener("keydown", (e) => {
	const pressText = e.key;

	if (pressText == "Enter") {
		if (isEnd) {
			return false;
		}

		// 괄호 안맞는 경우
		if (!checkBracket(expStr + inputStr)) {
			freezeButton();

			calculatorExp.innerHTML = `${expStr + inputStr}=`;
			calculatorInput.innerHTML = "Bracket ERROR";

			return false;
		}

		let finalExp = expStr + inputStr;

		// "숫자(숫자", "숫자)숫자" 에서 묵시적으로 * 삽입
		finalExp = finalExp.replace(/(\d)(\(\d)/gi, "$1*$2");
		finalExp = finalExp.replace(/(\d\))(\d)/gi, "$1*$2");

		let result;
		try {
			result = eval(finalExp).toString();
		} catch (e) {
			freezeButton();

			calculatorExp.innerHTML = `${expStr + inputStr}=`;
			calculatorInput.innerHTML = "Input ERROR";
			return false;
		}

		calculatorInput.innerHTML =
			result.length > 17 ? "..." + result.slice(result.length - 17) : result;
		calculatorExp.innerHTML = `${
			finalExp.length > 27
				? "..." + finalExp.slice(finalExp.length - 27)
				: finalExp
		}=`;

		expStr = result.toString();
		inputStr = "";
		isEnd = true;
	} else {
		switch (pressText) {
			case "Escape":
				expStr = "";
				inputStr = "";
				meltButton();
				break;

			case "Backspace":
			case "Delete":
				// <<, >>을 지우는 경우
				if (inputStr == "<" || ">")
					inputStr = inputStr.substr(0, inputStr.length - 1);
				else inputStr = inputStr.substr(0, inputStr.length);

				break;

			case "+":
			case "-":
			case "*":
			case "/":
			case "%":
			case "<<":
			case ">>":
			case "(":
			case ")":
				expStr += inputStr + pressText;
				inputStr = "";

				break;

			default:
				if (isEnd) {
					expStr = "";
				}
				// f1~f9, prtsc키등 입력 방지
				if (
					pressText in
					["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "(", ")"]
				)
					inputStr += pressText;
		}
		isEnd = false;

		calculatorInput.innerHTML =
			inputStr.length > 17
				? "..." + inputStr.slice(inputStr.length - 17)
				: inputStr;
		calculatorExp.innerHTML =
			expStr.length > 25 ? "..." + expStr.slice(expStr.length - 23) : expStr;
	}
});

// 툴팁 보이게 하는 버튼
const toolTipBtn = document.getElementsByClassName("tool-tip-button")[0];
const toolTip = document.getElementsByClassName("tool-tip")[0];

const toolTipPos = toolTip.getBoundingClientRect();
const btnPos = toolTipBtn.getBoundingClientRect();

const pos = {
	x: (btnPos.right - btnPos.left) / 2 + btnPos.left - toolTipPos.width / 2,
	y: `${btnPos.bottom + 10}`,
};

// 툴팁 버튼 클락시 툴팁 버튼 바로 아래에 툴팁 나옴
toolTipBtn.addEventListener("click", () => {
	if (toolTip.classList.contains("active")) {
		toolTip.style.left = -99999;
		toolTip.classList.remove("active");
		toolTipBtn.innerHTML = "view tip";
	} else {
		toolTip.style.setProperty("left", `${pos.x}`);
		toolTip.style.setProperty("top", `${pos.y}`);
		toolTip.classList.add("active");
		toolTipBtn.innerHTML = "close tip";
	}
});
