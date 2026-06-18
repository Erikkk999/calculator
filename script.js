const mainContainer = document.querySelector(".main-container");
const welcomeDisp = document.querySelector(".upper-display");
const buttons = document.querySelector(".button-container");
const powerBtn = document.querySelector("button[value='power']");
const upperTxt = document.querySelector(".upper-text");
const lowerTxt = document.querySelector(".lower-text");

const BOOT_DELAY_MS = 2000;
const SHUTDOWN_DELAY_MS = 3000;

const operations = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
};

const opDisplay = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷",
};

const state = {
    "isPowerOn": false,
    "isBooting": false,
    "powerMessageTimeout": null,
    "operator": null,
    "operand1": "",
    "operand2": "",
    "formattedResult": "",
    "isSafeDivide": true,
    "error": "",
    "isFinal": false,
};

const keyExceptions = {
    "Enter": "=",
    "Backspace": "backspace",
    "Delete": "clear-all",
    "Escape": "power",
};

buttons.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    
    handleInput(btn.value);
});

window.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;

    const value = keyExceptions[e.key] || e.key;
    const validActions =
        "0 1 2 3 4 5 6 7 8 9 . + - * / = backspace clear-all power".split(" ");

    if (!validActions.includes(value)) return;

    e.preventDefault();
    handleInput(value);
});

function handleInput(value) {
    if (value === "power") {
        togglePower();
    } else {
        calculate(value);
    }
}

function togglePower() {
    clearTimeout(state.powerMessageTimeout);

    state.isPowerOn = !state.isPowerOn;
    state.isBooting = true;
    renderPowerState();

    const delay = state.isPowerOn
        ? BOOT_DELAY_MS
        : SHUTDOWN_DELAY_MS;

    state.powerMessageTimeout = setTimeout(() => {
        state.isBooting = false;
        if (!state.isPowerOn) {
            clearAll();
        }
        renderPowerState();
    }, delay);
}

function renderPowerState() {
    if (!state.isPowerOn && !state.isBooting) {
        mainContainer.classList.add("off-state");
    } else {
        mainContainer.classList.remove("off-state");
    }

    if (state.isBooting) {
        welcomeDisp.classList.add("welcome");
        upperTxt.textContent = state.isPowerOn ? getGreeting() : "Arrivederci!";
        if (!state.isPowerOn) lowerTxt.textContent = ""; 
    } else {
        welcomeDisp.classList.remove("welcome");
        upperTxt.textContent = "";
    }

    powerBtn.textContent = state.isPowerOn ? "OFF" : "ON";
}

function updateDisplay() {
    const displayOperand1 = addSeparators(state.operand1);
    const displayOperand2 = addSeparators(state.operand2);
    const displayOperator = opDisplay[state.operator] || "";
    const displayResult = state.formattedResult
        ? addSeparators(state.formattedResult)
        : state.error;

    const upperTxtString = state.isFinal
        ? ""
        : `${displayOperand1} ${displayOperator} ${displayOperand2}`.trim();

    upperTxt.classList.toggle("upper-text-size", upperTxtString.length > 20);
    upperTxt.textContent = upperTxtString;
    lowerTxt.classList.remove("final-result");

    if (state.isFinal) {
        lowerTxt.classList.add("final-result");
        lowerTxt.classList.toggle("lower-text-size", displayResult.length > 14);
        lowerTxt.textContent = `= ${displayResult}`;
    } else if (state.operand1 && state.operator && state.operand2) {
        lowerTxt.classList.toggle("lower-text-size", displayResult.length > 17);
        lowerTxt.textContent = displayResult;
    } else {
        lowerTxt.textContent = "";
    }
}

function calculate(value) {
    if (state.isBooting || !state.isPowerOn) return;

    if (value === "clear-all") {
        clearAll();
    } else if (value === "backspace") {
        backspace();
    } else if (value === "=") {
        handleEquals();
    } else if (value === "-" && !state.operand1) {
        state.operand1 = "-";
    } else if (value in operations) {
        setOperator(value);
    } else {
        handleOperand(value);
    }

    computeResult();
    updateDisplay();
}

function handleOperand(value) {
    if (state.isFinal) {
        clearAll();
    }

    if (!state.operator) {
        state.operand1 = updateOperand(state.operand1, value);
    } else {
        state.operand2 = updateOperand(state.operand2, value);
    }
}

function updateOperand(currentValue, value) {
    if (value === ".") {
        if (currentValue.includes(".")) return currentValue;
        if (currentValue === "") return "0.";
        if (currentValue === "-") return "-0.";
    }

    if ((currentValue === "0" || currentValue === "-0") && value !== ".") {
        return currentValue === "-0" ? "-" + value : value;
    }

    if (value !== ".") {
        const digitsOnly = currentValue.replace(/[^0-9]/g, "");
        
        if (digitsOnly.length >= 12) return currentValue;
    }

    return currentValue + value;
}

function setOperator(value) {
    if (!state.operand1 || state.operand1 === "-") return;

    if (state.operand2) {
        if (!state.isSafeDivide) return;
        state.operand1 = state.formattedResult;
        state.operand2 = "";
    }

    state.operator = value;
    state.isFinal = false;
}

function computeResult() {
    state.isSafeDivide = true;

    if (!state.operator || !state.operand2) return;

    if (+state.operand2 === 0 && state.operator === "/") {
        state.isSafeDivide = false;
        state.formattedResult = "";
        state.error = "Can't divide with zero";
        return;
    }
    
    const result =
        operate(state.operator, +state.operand1, +state.operand2);
        
    state.formattedResult = formatForDisplay(result);
}

function formatForDisplay(value) {
    const maxChars = 12;
    const strValue = value.toString();
  
    if (strValue.length <= maxChars) return strValue;

    if (Math.abs(value) >= 1e9 || (Math.abs(value) < 0.0001 && value !== 0)) {
        return value.toExponential(maxChars - 5); 
    }

    return Number(value.toPrecision(maxChars)).toString();
}

function handleEquals() {
    if (!state.isSafeDivide
        || !state.operator
        || !state.operand2) return;

    state.operand1 = state.formattedResult;
    state.operand2 = "";
    state.operator = null;
    state.isFinal = true;
}

function clearAll() {
    state.operand1 = "";
    state.operand2 = "";
    state.operator = null;
    state.formattedResult = "";
    state.isSafeDivide = true;
    state.isFinal = false;
}

function backspace() {
    if (state.operand2) {
        state.operand2 = state.operand2.slice(0, -1);
    } else if (state.operator) {
        state.operator = null;
    } else {
        state.operand1 = state.operand1.slice(0, -1);
    }
}

function add(value1, value2) {
    return value1 + value2;
}

function subtract(value1, value2) {
    return value1 - value2;
}

function multiply(value1, value2) {
    return value1 * value2;
}

function divide(value1, value2) {
    return value1 / value2;
}

function operate(operator, value1, value2) {
    return operations[operator](value1, value2);
}

function addSeparators(number) {
    const strNumber = String(number);

    if (strNumber.includes("e") || strNumber === "-") return strNumber;

    const [int, decimal] = strNumber.split(".");
    const isNegative = int.startsWith("-");
    const digits = isNegative ? int.slice(1) : int;

    const formatted = [...digits]
        .reverse()
        .map((d, i) => (i && i % 3 === 0 ? d + " " : d))
        .reverse()
        .join("");

    const result = isNegative ? "-" + formatted : formatted;

    return decimal !== undefined ? `${result}.${decimal}` : result;
}

function getGreeting() {
    return new Date().getHours() >= 14 ? "Buonasera!" : "Buongiorno!";
}
