let score = 0;
let timeLeft = 10;
let timerStarted = false;

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
  const countdown = setInterval(() => {
    timeLeft--;
    timerElement.innerText = "Time left: " + timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(countdown);
      alert("Time's up! Final score: " + score);
    }
  }, 1000);
}

