const start = document.getElementById("start");
const stop = document.getElementById("stop");
const userInput = document.getElementById("user-input");
const time = document.getElementById("time");
const totalDisplay = document.getElementById("total-time");

let intervalId = null;
let totalSecondsToday = 0;
let remainingSeconds = 0;
let originalSessionSeconds = 0;

/* ---------------- DATE ---------------- */

function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

/* ---------------- FORMAT TIME (HH:MM:SS) ---------------- */

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0")
    );
}

/* ---------------- LOCAL STORAGE ---------------- */

function saveTime() {
    localStorage.setItem("studyTime", JSON.stringify({
        date: getTodayDate(),
        totalSeconds: totalSecondsToday
    }));
}

function loadStoredTime() {
    const stored = JSON.parse(localStorage.getItem("studyTime"));

    if (stored && stored.date === getTodayDate()) {
        totalSecondsToday = stored.totalSeconds;
    } else {
        totalSecondsToday = 0;
        saveTime();
    }

    updateTotalDisplay();
}

/* ---------------- UPDATE TOTAL UI ---------------- */

function updateTotalDisplay() {
    totalDisplay.innerText = "Today Total: " + formatTime(totalSecondsToday);
}

/* ---------------- START TIMER ---------------- */

start.addEventListener("click", () => {

    const minutes = Number(userInput.value);

    if (!minutes || minutes <= 0) {
        alert("Enter valid minutes");
        return;
    }

    clearInterval(intervalId); // stop old timer

    originalSessionSeconds = minutes * 60;
    remainingSeconds = originalSessionSeconds;

    time.innerText = formatTime(remainingSeconds);

    intervalId = setInterval(() => {

        remainingSeconds--;
        time.innerText = formatTime(remainingSeconds);

        if (remainingSeconds <= 0) {
            clearInterval(intervalId);

            totalSecondsToday += originalSessionSeconds;
            saveTime();
            updateTotalDisplay();

            time.innerText = "Time's Up!";
        }

    }, 1000);
});

/* ---------------- STOP TIMER ---------------- */

stop.addEventListener("click", () => {

    clearInterval(intervalId);

    const studiedSeconds = originalSessionSeconds - remainingSeconds;

    if (studiedSeconds > 0) {
        totalSecondsToday += studiedSeconds;
        saveTime();
        updateTotalDisplay();
    }

    time.innerText = "Stopped";
});

/* ---------------- INIT ---------------- */

loadStoredTime();