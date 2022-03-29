const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 5;
const ALERT_THRESHOLD = 2;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

let time_limit = 60;
let timePassed = 0;
let timeLeft = time_limit;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

/**
 * Fonction qui affiche le timer
 * @param time
 */
function setTimer(time) {
    time_limit = time ? time : 60;
    document.getElementById("coolDown").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(
            timeLeft
        )}</span>
    </div>
    `;
}

function onTimesUp() {
    clearInterval(timerInterval);
}

/* Fonction qui reset le timer. */
function resetTimer() {
    onTimesUp();
    timePassed = 0;
    timeLeft = time_limit;
    remainingPathColor = COLOR_CODES.info.color;
    resetRemainingPathColor();
}

/** Fonction qui lance le timer.
*  Une fois que le timer arrive à 0, on reset le timer.
 *  *  */
function startTimer(data) {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = time_limit - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(
            timeLeft
        );
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        // lorsque le timer arrive à 0
        if (timeLeft === 0) {
            resetTimer();
            checkInput(data);
        }
    }, 1000);
}


/** Le code suivant est pris du web, il gère le timer.
 * le code ci-dessus aussi provient du web, mais nous l'avons modifié pour notre jeu.
 * source : https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
 * **/

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function resetRemainingPathColor() {
    const { alert, warning, info } = COLOR_CODES;
    document.getElementById("base-timer-path-remaining")
        .classList.remove(alert.color);
    document.getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining")
        .classList.add(info.color);
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / time_limit;
    return rawTimeFraction - (1 / time_limit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}