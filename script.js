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
    "powerMessageTimeout": null,
    "operator": null,
    "operand1": "",
    "operand2": "",
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
        mainContainer.classList.remove("off-state");
        welcomeDisp.classList.add("welcome");
        upperTxt.textContent = "Buongiorno!";
        btn.textContent = "OFF";

        state.powerMessageTimeout = setTimeout(() => {
            upperTxt.textContent = "";
            welcomeDisp.classList.remove("welcome");
        }, BOOT_DELAY_MS);

    } else {
        welcomeDisp.classList.add("welcome");
        upperTxt.textContent = "Arrivederci!";
        lowerTxt.textContent = "";

        state.powerMessageTimeout = setTimeout(() => {
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
}

function calculate(btn) {
    const value = btn.value;

    if (btn.classList.contains("operator")) {
        setOperator(value);
    } else {
        handleOperand(value);
    }

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

    state.operator = value;
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
