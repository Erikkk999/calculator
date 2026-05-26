const mainContainer = document.querySelector(".main-container");
const buttons = document.querySelector(".button-container");
const upperText = document.querySelector(".upper-text");

let isPowerOn = false;
let powerMessageTimeout;

buttons.addEventListener("click", (e) => {
        const button = e.target;
        if (button.classList.contains("power")) {
        togglePower(button);
        }
    });

function togglePower(btn) {
    isPowerOn = !isPowerOn;

    clearTimeout(powerMessageTimeout);

    if (isPowerOn) {
        mainContainer.classList.remove("off-state");
        btn.textContent = "OFF";
        upperText.textContent = "Buongiorno!";

        powerMessageTimeout = setTimeout(() => {
            upperText.textContent = "";
        }, 3000);

    } else {
        upperText.textContent = "Arrivederci!";

        powerMessageTimeout = setTimeout(() => {
            upperText.textContent = "";
            btn.textContent = "ON";
            mainContainer.classList.add("off-state");
        }, 2000);
    }
}
