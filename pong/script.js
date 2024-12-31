// Canvas setup
const canva = document.getElementById("gameCanvas");
const ctx = canva.getContext("2d");

canva.width = 2000;
canva.height = 1000;

// Constants and variables
const maxSpeed = 20;
let score1 = 0;
let score2 = 0;
let gameRunning = true;

// Rectangle class
class Rectangle {
    constructor(x, y, width, height, color, speedX = 0, speedY = 0, type = "") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.type = type; // 'P' for paddle, 'E' or 'O' for secondary paddles, '' for others
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY = Math.max(Math.min(this.speedY, maxSpeed), -maxSpeed);

        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canva.height) this.y = canva.height - this.height;
    }
}

// Ball
class Ball {
    constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y - this.radius < 0 || this.y + this.radius > canva.height) {
            this.speedY *= -1; // Reverse Y direction
        }
    }
}

// Initialize objects
const leftPaddle = new Rectangle(20, 250, 20, 250, "red");
const rightPaddle = new Rectangle(canva.width - 40, 250, 20, 250, "green");
const ball = new Ball(canva.width / 2, canva.height / 2, 10, "white", 5, 3);
const secondaryLeft = new Rectangle(0, 0, 0, 0, "blue");
const secondaryRight = new Rectangle(canva.width + 500, 0,0, 200, "blue");

// Key handling
const keys = {};
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function handlePaddleMovement() {
    if (keys["z"]) leftPaddle.speedY = -5;
    else if (keys["s"]) leftPaddle.speedY = 5;
    else leftPaddle.speedY = 0;

    if (keys["ArrowUp"]) rightPaddle.speedY = -5;
    else if (keys["ArrowDown"]) rightPaddle.speedY = 5;
    else rightPaddle.speedY = 0;

    leftPaddle.move();
    rightPaddle.move();
}

// Ball collision detection
function checkCollisions() {
    // Paddle collisions
    if (
        ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.speedX *= -1;
        ball.speedY += leftPaddle.speedY / 2;
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    }

    if (
        ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.speedX *= -1;
        ball.speedY += rightPaddle.speedY / 2;
        ball.x = rightPaddle.x - ball.radius;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        score2++;
        resetBall();
    } else if (ball.x + ball.radius > canva.width) {
        score1++;
        resetBall();
    }

    // End game
    if (score1 === 10 || score2 === 10) {
        gameRunning = false;
    }
}

function resetBall() {
    ball.x = canva.width / 2;
    ball.y = canva.height / 2;
    ball.speedX *= -1;
    ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Draw scores
function drawScores() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Player 1: ${score1}`, 50, 50);
    ctx.fillText(`Player 2: ${score2}`, canva.width - 150, 50);
    ctx.fillText('ball speed: ' + ball.speedY, 50, 100);
}

// Game loop
function gameLoop() {
    if (!gameRunning) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canva.width / 2 - 75, canva.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canva.width, canva.height);

    // Draw objects
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();
    secondaryLeft.draw();
    secondaryRight.draw();

    // Handle movements
    handlePaddleMovement();
    ball.move();

    // Check collisions
    checkCollisions();

    // Draw scores
    drawScores();

    requestAnimationFrame(gameLoop);
}

// Start the game
resetBall();
gameLoop();
