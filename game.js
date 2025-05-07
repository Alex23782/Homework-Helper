let score = 0;
let highScore = 0;
let timeLeft = 10;
let timerStarted = false;
let countdown;

function increaseScore() {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  if (timeLeft > 0) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
  }
}

function startTimer() {
  const timerElement = document.getElementById("timer");

  countdown = setInterval(() => {
    timeLeft--;
    timerElement.innerText = "Time left: " + timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
}

function endGame() {
  if (score > highScore) {
    highScore = score;
    document.getElementById("high-score").
