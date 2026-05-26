const mainContainer = document.querySelector(".main-container");
const welcomeDisp = document.querySelector(".upper-display");
const buttons = document.querySelector(".button-container");
const upperTxt = document.querySelector(".upper-text");
const lowerTxt = document.querySelector(".lower-text");

let isPowerOn = false;
let powerMessageTimeout;

buttons.addEventListener("click", (e) => {
    const button = e.target;
    if (!button.classList.contains("button")) return;
    if (button.classList.contains("power")) {
        togglePower(button);
    }
});

function togglePower(btn) {
    isPowerOn = !isPowerOn;

    clearTimeout(powerMessageTimeout);

    if (isPowerOn) {
        mainContainer.classList.remove("off-state");
        welcomeDisp.classList.add("welcome");
        upperTxt.textContent = "Buongiorno!";
        btn.textContent = "OFF";

        powerMessageTimeout = setTimeout(() => {
            upperTxt.textContent = "";
            welcomeDisp.classList.remove("welcome");
        }, 2000);

    } else {
        welcomeDisp.classList.add("welcome");
        upperTxt.textContent = "Arrivederci!";

        powerMessageTimeout = setTimeout(() => {
            upperTxt.textContent = "";
            welcomeDisp.classList.remove("welcome");
            mainContainer.classList.add("off-state");
            btn.textContent = "ON";
        }, 3000);
    }
}