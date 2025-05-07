// Set up canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fill window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ball properties
const ballRadius = 15;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 4;
let ballSpeedY = -4;

// Platform properties
const platformHeight = 20;
const platformWidth = 150;
let platformX = (canvas.width - platformWidth) / 2;
const platformSpeed = 7;
let rightPressed = false;
let leftPressed = false;

// Score
let score = 0;

// Key event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00FF00";
  ctx.fill();
  ctx.closePath();
}

function drawPlatform() {
  ctx.beginPath();
  ctx.rect(platformX, canvas.height - platformHeight, platformWidth, platformHeight);
  ctx.fillStyle = "#00FFFF";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  if (ballY + ballSpeedY > canvas.height - ballRadius - platformHeight) {
    if (ballX > platformX && ballX < platformX + platformWidth) {
      ballSpeedY = -ballSpeedY;
      score++;
    } else {
      // Game Over logic (for example, stop the game or reset)
      alert("GAME OVER");
      document.location.reload();
    }
  }
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY + ballSpeedY < ballRadius) {
    ballSpeedY = -ballSpeedY;
  }

  collisionDetection();
}

function movePlatform() {
  if (rightPressed && platformX < canvas.width - platformWidth) {
    platformX += platformSpeed;
  } else if (leftPressed && platformX > 0) {
    platformX -= platformSpeed;
  }
}

function updateScore() {
  document.getElementById("score").textContent = "Score: " + score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  drawBall();
  drawPlatform();
  moveBall();
  movePlatform();
  updateScore();

  requestAnimationFrame(draw);
}

draw();
