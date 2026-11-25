
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const keysEl = document.querySelector(".keys");


let current = "0";        
let previous = null;      
let operator = null;      
let justCalculated = false; 


function updateDisplay() {
  resultEl.textContent = current;
  historyEl.textContent = previous !== null && operator ? `${previous} ${operator}` : "";
}


function inputNumber(num) {
  if (justCalculated) {
    current = num;
    justCalculated = false;
  } else if (current === "0") {
    current = num;
  } else if (current.length < 12) {
    current += num;
  }
}


function inputDecimal() {
  if (justCalculated) {
    current = "0";
    justCalculated = false;
  }
  if (!current.includes(".")) current += ".";
}


function chooseOperator(op) {
 
  if (operator && previous !== null && !justCalculated) {
    calculate(true);
  }
  previous = current;
  operator = op;
  justCalculated = false;
  current = "0";
}


function calculate(isChain = false) {
  if (operator === null || previous === null) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let answer;

  switch (operator) {
    case "+": answer = a + b; break;
    case "-": answer = a - b; break;
    case "x": answer = a * b; break;
    case "÷":
      if (b === 0) {
        showError();
        return;
      }
      answer = a / b;
      break;
  }

  
  answer = parseFloat(answer.toFixed(10));
  let text = String(answer);
  if (text.length > 12) text = answer.toPrecision(8).replace(/\.?0+(e|$)/, "$1");

  if (!isChain) historyEl.textContent = `${previous} ${operator} ${b} =`;

  current = text;
  previous = null;
  operator = null;
  justCalculated = !isChain;
}

function showError() {
  current = "Error";
  previous = null;
  operator = null;
  justCalculated = true;
  historyEl.textContent = "";
}


function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justCalculated = false;
}

function deleteLast() {
  if (justCalculated || current === "Error") {
    current = "0";
    justCalculated = false;
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function percent() {
  if (current === "Error") return;
  current = String(parseFloat((parseFloat(current) / 100).toFixed(10)));
}


keysEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  
  if (current === "Error" && action !== "clear") clearAll();

  switch (action) {
    case "number":   inputNumber(value); break;
    case "decimal":  inputDecimal(); break;
    case "operator": chooseOperator(value); break;
    case "equals":
      calculate();
      resultEl.textContent = current;
      return; 
    case "clear":    clearAll(); break;
    case "delete":   deleteLast(); break;
    case "percent":  percent(); break;
  }

  updateDisplay();
});


document.addEventListener("keydown", (e) => {
  const k = e.key;

  if (current === "Error") clearAll();

  if (/^[0-9]$/.test(k)) inputNumber(k);
  else if (k === ".") inputDecimal();
  else if (k === "+") chooseOperator("+");
  else if (k === "-") chooseOperator("-");
  else if (k === "*" || k === "x" || k === "X") chooseOperator("x");
  else if (k === "/") { e.preventDefault(); chooseOperator("÷"); }
  else if (k === "Enter" || k === "=") {
    e.preventDefault();
    calculate();
    resultEl.textContent = current;
    return;
  }
  else if (k === "Backspace") deleteLast();
  else if (k === "Escape") clearAll();
  else if (k === "%") percent();
  else return;



  updateDisplay();
});


updateDisplay();