const mainContainer = document.querySelector(".main-container");
const welcomeDisp = document.querySelector(".upper-display");
const buttons = document.querySelector(".button-container");
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

const operatorDisplay = {
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
    "result": "",
    "isSafeDivide": true,
};

buttons.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.value === "power") {
        togglePower(btn);
        return;
    }
    calculate(btn);
    console.log(state.operand1, state.operator, state.operand2)
});

function togglePower(btn) {
    state.isPowerOn = !state.isPowerOn;
    clearTimeout(state.powerMessageTimeout);

    if (state.isPowerOn) {
        state.isBooting = true;
        mainContainer.classList.remove("off-state");
        welcomeDisp.classList.add("welcome");
        upperTxt.textContent = "Buongiorno!";
        btn.textContent = "OFF";

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
            btn.textContent = "ON";
        }, SHUTDOWN_DELAY_MS);
    }
}

function updateDisplay() {
    upperTxt.textContent = `${state.operand1}
        ${operatorDisplay[state.operator] || ""}
        ${state.operand2}`;
    
    if (state.operand1 && state.operator && state.operand2) {
        lowerTxt.textContent = `${state.result}`;
        lowerTxt.classList.add("instant-result");
    } else {
        lowerTxt.textContent = "";
        lowerTxt.classList.remove("instant-result");
    }
}

function calculate(btn) {
    const value = btn.value;

    if (state.isBooting || !state.isPowerOn) return;

    if (value === "clear-all") {
        clearAll();
    } else if (value === "backspace") {
        backspace();
    } else if (btn.classList.contains("operator")) {
        setOperator(value);
    } else {
        handleOperand(value);
    }

    getResult();
    updateDisplay();
}

function handleOperand(value) {
    if (!state.operator) {
        state.operand1 += value;
    } else {
        state.operand2 += value;
    }
}

function setOperator(value) {
    if (!state.operand1) return;

    if (state.operand2) {
        getResult();
        if (!state.isSafeDivide) return;
        state.operand1 = state.result;
        state.operand2 = "";
    }

    state.operator = value;
}

function getResult() {
    state.isSafeDivide = true;

    if (!state.operator || !state.operand2) return;

    if (+state.operand2 === 0 && state.operator === "/") {
        state.isSafeDivide = false;
        state.result = "Can't divide with zero";
        return;
    }
    
    state.result = operate(state.operator, +state.operand1, +state.operand2);
}

function clearAll() {
    state.operand1 = "";
    state.operand2 = "";
    state.operator = null;
    state.result = "";
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
