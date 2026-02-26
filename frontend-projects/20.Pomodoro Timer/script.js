const start = document.getElementById("start");
const stop = document.getElementById("stop");
const userInput = document.getElementById("user-input");
const time = document.getElementById("time");
const totalDisplay = document.getElementById("total-time");

let intervalId = null;
let totalSecondsToday = 0;
let remainingSeconds = 0;
let originalSessionSeconds = 0;

/* ---------------- REQUEST NOTIFICATION PERMISSION ---------------- */

if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

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

/* ---------------- BEEP SOUND (REAL SOUND) ---------------- */

function playBeep(duration = 500, frequency = 800) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        audioCtx.currentTime + duration / 1000
    );

    setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
    }, duration);
}

/* ---------------- NOTIFICATION ---------------- */

function showNotification(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: message
        });
    }
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

/* ---------------- UPDATE TOTAL DISPLAY ---------------- */

function updateTotalDisplay() {
    totalDisplay.innerText = formatTime(totalSecondsToday);
}

/* ---------------- START TIMER ---------------- */

start.addEventListener("click", () => {

    const minutes = Number(userInput.value);

    if (!minutes || minutes <= 0) {
        alert("Enter valid minutes");
        return;
    }

    clearInterval(intervalId);

    originalSessionSeconds = minutes * 60;
    remainingSeconds = originalSessionSeconds;

    time.innerText = formatTime(remainingSeconds);

    showNotification("Timer Started", "Focus session started.");
    playBeep(200, 600); // soft start sound

    if (navigator.vibrate) navigator.vibrate(100);

    intervalId = setInterval(() => {

        remainingSeconds--;
        time.innerText = formatTime(remainingSeconds);

        if (remainingSeconds <= 0) {
            clearInterval(intervalId);

            totalSecondsToday += originalSessionSeconds;
            saveTime();
            updateTotalDisplay();

            time.innerText = "Time's Up!";

            showNotification("Time's Up!", "Session completed!");

            playBeep(800, 900); // strong end beep
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
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

    showNotification("Timer Stopped", "Session stopped.");
    playBeep(300, 500);

    if (navigator.vibrate) navigator.vibrate(150);
});

/* ---------------- INIT ---------------- */

loadStoredTime();