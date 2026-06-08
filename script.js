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
    "fixedResult": "",
    "isSafeDivide": true,
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
    state.isPowerOn = !state.isPowerOn;
    clearTimeout(state.powerMessageTimeout);

    if (state.isPowerOn) {
        state.isBooting = true;
        mainContainer.classList.remove("off-state");
        welcomeDisp.classList.add("welcome");
        upperTxt.textContent = "Buongiorno!";
        powerBtn.textContent = "OFF";

        state.powerMessageTimeout = setTimeout(() => {
            state.isBooting = false;
            upperTxt.textContent = "";
            welcomeDisp.classList.remove("welcome");
        }, BOOT_DELAY_MS);

    } else {
        state.isBooting = true;
        welcomeDisp.classList.add("welcome");
        upperTxt.textContent = "Arrivederci!";
        lowerTxt.textContent = "";

        state.powerMessageTimeout = setTimeout(() => {
            state.isBooting = false;
            clearAll();
            upperTxt.textContent = "";
            welcomeDisp.classList.remove("welcome");
            mainContainer.classList.add("off-state");
            powerBtn.textContent = "ON";
        }, SHUTDOWN_DELAY_MS);
    }
}

function updateDisplay() {
    upperTxt.textContent =
        `${state.operand1} ${opDisplay[state.operator] || ""} ${state.operand2}`
            .trim();

    if (state.isFinal) {
        upperTxt.textContent = "";
        lowerTxt.textContent = `= ${state.fixedResult}`;
        lowerTxt.classList.remove("instant-result");
        lowerTxt.classList.add("final-result");
    } else if (state.operand1 && state.operator && state.operand2) {
        lowerTxt.textContent = `${state.fixedResult}`;
        lowerTxt.classList.add("instant-result");
        lowerTxt.classList.remove("final-result");
    } else {
        lowerTxt.textContent = "";
        lowerTxt.classList.remove("instant-result", "final-result");
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

    getResult();
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

    if (currentValue === "0" && value !== ".") {
        return value;
    }

    if (value !== ".") {
        const digitsOnly = currentValue.replace(/[^0-9]/g, "");
        
        if (digitsOnly.length >= 9) return currentValue;
    }

    return currentValue + value;
}

function setOperator(value) {
    if (!state.operand1 || state.operand1 === "-") return;

    if (state.operand2) {
        getResult();
        if (!state.isSafeDivide) return;
        state.operand1 = state.fixedResult;
        state.operand2 = "";
    }

    state.operator = value;
    state.isFinal = false;
}

function getResult() {
    state.isSafeDivide = true;

    if (!state.operator || !state.operand2) return;

    if (+state.operand2 === 0 && state.operator === "/") {
        state.isSafeDivide = false;
        state.fixedResult = "Can't divide with zero";
        return;
    }
    
    const result =
        operate(state.operator, +state.operand1, +state.operand2);

    state.fixedResult = getFixedResult(result);
}

function getFixedResult(value) {
    return Number.isInteger(value) ? value.toString() :
        (Math.round(value * 1000) / 1000).toString();
}

function handleEquals() {
    if (!state.isSafeDivide ||
        !state.operator ||
        !state.operand2) return;

    state.operand1 = state.fixedResult;
    state.operand2 = "";
    state.operator = null;
    state.isFinal = true;
}

function clearAll() {
    state.operand1 = "";
    state.operand2 = "";
    state.operator = null;
    state.fixedResult = "";
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
