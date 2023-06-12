const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 5;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;
const snackParts = [];
let tailLength = 0;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let appleX = 5;
let appleY = 5;

let score = 0;

let previousXVelocity = 0;
let previousYVelocity = 0;

function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;
  if (previousXVelocity === 1 && xVelocity === -1) {
    xVelocity = previousXVelocity;
  }


  if (previousXVelocity === -1 && xVelocity === 1) {
    xVelocity = previousXVelocity;
  }


  if (previousYVelocity === -1 && yVelocity === 1) {
    yVelocity = previousYVelocity;
  }


  if (previousYVelocity === 1 && yVelocity === -1) {
    yVelocity = previousYVelocity;
  }

  previousXVelocity = xVelocity;
  previousYVelocity = yVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    document.body.removeEventListener("keydown", keyDown);
    return;
  }
  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();
  if (score > 5) {
    speed = 10;
  }
  if (score > 10) {
    speed = 15;
  }
  if (score > 15) {
    speed = 20;
  }
  if (score > 20) {
    speed = 25;
  }
  if (score > 25) {
    speed = 30;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) return false;
  //walls
  if (headX < 0 || headY < 0 || headX >= tileCount || headY >= tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snackParts.length; i++) {
    let part = snackParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    playSound("./crash.mp3");
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";
    ctx.fillText("Game Over", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px verdana";
  ctx.fillText("Score: " + score, canvas.width - 60, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snackParts.length; i++) {
    let part = snackParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  snackParts.push(new SnakePart(headX, headY));
  while (snackParts.length > tailLength) {
    snackParts.shift();
  }
  ctx.fillStyle = "orange";
  ctx.fillRect(
    headX * (tileSize + 2),
    headY * (tileSize + 2),
    tileSize,
    tileSize
  );
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    playSound("./eat.mp3", 0.5);
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  switch (event.key) {
    case "ArrowUp": {
      inputsYVelocity = -1;
      inputsXVelocity = 0;
      break;
    }
    case "ArrowDown": {
      inputsYVelocity = 1;
      inputsXVelocity = 0;
      break;
    }
    case "ArrowLeft": {
      inputsYVelocity = 0;
      inputsXVelocity = -1;
      break;
    }
    case "ArrowRight": {
      inputsYVelocity = 0;
      inputsXVelocity = 1;
      break;
    }
  }
}

function playSound(src, loud = 1) {
  let sound = new Audio(src);
  sound.volume = loud;
  sound.play();
}

drawGame();
