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
    if (btn.classList.contains("power")) {
        togglePower(btn);
        return;
    }
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
