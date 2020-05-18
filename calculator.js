const buttons = Array.from(document.getElementsByTagName("button"));
const calculatorExp = document.getElementsByClassName(
	"calculator_display_expression"
)[0];
const calculatorInput = document.getElementsByClassName(
	"calculator_display_input"
)[0];

var expStr = "";
var inputStr = "";

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
			if (expStr == "") return false;

			// 괄호 안맞는 경우
			if (!checkBracket(expStr + inputStr)) {
				freezeButton();

				calculatorExp.innerHTML = `${expStr + inputStr}=`;
				calculatorInput.innerHTML = "Bracket ERROR";

				return false;
			}

			let result = eval(expStr + inputStr);

			calculatorInput.innerHTML = result;
			calculatorExp.innerHTML = `${expStr + inputStr}=`;

			expStr = result.toString();
			inputStr = "";
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
					expStr += inputStr + pressText;
					inputStr = "";
					break;

				default:
					inputStr += pressText;
			}

			calculatorInput.innerHTML = inputStr;
			calculatorExp.innerHTML = expStr;
		}
	})
);
