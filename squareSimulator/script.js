// Canvas setup
const canva = document.querySelector('canvas');
canva.style.border = '1px solid black';
const ctx = canva.getContext('2d');
canva.width = 2000;
canva.height = 2000;

// Game state
let gameRunning = false;

// Random color list
const colorlist = Array.from({ length: 100 }, () =>
    `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
);

// Particle class
class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.lifetime = 60; // Frames before disappearing
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.lifetime--;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Square class
class Square {
    constructor(x, y, size, color, speedX, speedY, text) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.exploded = false;
        this.text = text;
        
    }

    move() {
        if (this.exploded) return;

        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls and decrease size
        if (this.x + this.size > canva.width || this.x < 0) {
            this.speedX = -this.speedX;
            // Push toward the opposite direction when hitting the wall
            if (this.x + this.size > canva.width) {
                this.x = canva.width - this.size;  // Keep object within bounds
            } else if (this.x < 0) {
                this.x = 0;  // Keep object within bounds
            }
            // Optional: Delay size increase by 1 second
            /*setTimeout(() => {
                this.size = Math.max(0, this.size + 10);
            }, 500);*/
        }
        
        if (this.y + this.size > canva.height || this.y < 0) {
            this.speedY = -this.speedY;
            // Push toward the opposite direction when hitting the wall
            if (this.y + this.size > canva.height) {
                this.y = canva.height - this.size;  // Keep object within bounds
            } else if (this.y < 0) {
                this.y = 0;  // Keep object within bounds
            }
            // Optional: Delay size increase by 1 second
            /*setTimeout(() => {
                this.size = Math.max(0, this.size + 10);
            }, 500);*/
        }
        

        // Trigger explosion if size is 0
        if (this.size <= 0) {
            this.explode();
        }
    }

    draw(ctx) {
        if (!this.exploded) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.fillStyle = 'black';  // Text color
            ctx.font = '20px Arial';  // Font size and family


            const textWidth = ctx.measureText(this.text).width;
            const textHeight = 20; // Approximate height of the text
            const textX = this.x + (this.size - textWidth) / 2; 
            const textY = this.y + (this.size + textHeight) / 2; 
            this.text = " " + (this.size + 1);  // Example text
            ctx.fillText(this.text, textX, textY);
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
            const speedX = (Math.random() - 0.5) * 10;
            const speedY = (Math.random() - 0.5) * 10;
            const particleSize = Math.random() * 5 + 2;
            const particleColor = colorlist[Math.floor(Math.random() * colorlist.length)];
            particles.push(new Particle(this.x + this.size / 2, this.y + this.size / 2, particleSize, particleColor, speedX, speedY));
        }
    }
}

class food{
    constructor(x, y, size,color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();  // Start a new path
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);  // Draw a circle
        ctx.fill();  // Fill the circle
    }

}

// Game entities
const particles = [];
let squares = [];
let activeSquares = []; // Array for active squares only (off-screen squares removed)
let foods = [];

// Function to detect collision between two squares
function checkCollision(squareA, squareB) {
    return (
        squareA.x + squareA.size > squareB.x &&
        squareA.x < squareB.x + squareB.size &&
        squareA.y + squareA.size > squareB.y &&
        squareA.y < squareB.y + squareB.size
    );
}
function checkCollision(square, food) {
    return (
        square.x + square.size > food.x &&
        square.x < food.x + food.size &&
        square.y + square.size > food.y &&
        square.y < food.y + food.size
    );
}

// Initialize a new square
function initialiseSquare() {
    const x = Math.random() * canva.width;
    const y = Math.random() * canva.height;
    const size = 100;
    const color = colorlist[Math.floor(Math.random() * colorlist.length)];
    const speedX = Math.random() * 4 + 1;
    const speedY = Math.random() * 4 + 1;
    const text = " " + (squares.length + 1);  // Example text
    const square = new Square(x, y, size, color, speedX, speedY, text);
     
    activeSquares.push(square);
    squares.push(square);
}
function initialiseFood(){
    const x = Math.random() * canva.width ;
    const y = Math.random() * canva.height ;
    const size = 8;
    const brightAestheticColors = [
        '#FF7F7F', // Soft Bright Red
        '#6EC5FF', // Bright Sky Blue
        '#66F2D1', // Light Mint Green
        '#FFD566', // Light Warm Yellow
        '#C57EFF', // Soft Lavender Purple
        '#FFB74D', // Light Bright Orange
        '#FF80BF', // Soft Light Pink
        '#F1887F', // Warm Beige Brown
        '#F4F4F4'  // Light Off-White
    ];
    const color = brightAestheticColors[Math.floor(Math.random() * brightAestheticColors.length)];
    
    const foodi = new food(x, y, size, color);
     
    foods.push(foodi);
}

// Update canvas
function updateCanvas() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canva.width, canva.height);

    // Remove off-screen squares and explosions
    activeSquares = squares.filter(square => !square.exploded && square.x + square.size > 0 && square.x < canva.width && square.y + square.size > 0 && square.y < canva.height);

    // Check for collisions and apply physics (optimized)
    for (let i = 0; i < activeSquares.length; i++) {
        for (let j = i + 1; j < activeSquares.length; j++) {
            if (checkCollision(activeSquares[i], activeSquares[j])) {
                activeSquares[i].speedX = -activeSquares[i].speedX; // Reverse X velocity
                activeSquares[i].speedY = -activeSquares[i].speedY; // Reverse Y velocity
                activeSquares[j].speedX = -activeSquares[j].speedX; // Reverse X velocity
                activeSquares[j].speedY = -activeSquares[j].speedY; // Reverse Y velocity
                if(activeSquares[i].size > activeSquares[j].size ) {
                    activeSquares[j].size -=10;
                    if(activeSquares[j].size < 10){
                        activeSquares[i].size +=10*Math.sqrt(16);
                    }
                    else{
                        activeSquares[i].size -=Math.sqrt(4);
                    }
                
                    
                }
                
                else {
                    activeSquares[j].size -=10;
                    if(activeSquares[i].size < 10){
                        activeSquares[j].size +=10*Math.sqrt(16);
                    }
                    else{
                        activeSquares[j].size -=Math.sqrt(4);
                    }
                }
            }
        }
    }
    for (let i = 0; i < activeSquares.length; i++) {
        for (let j = 0; j < foods.length; j++) {
            if (checkCollision(activeSquares[i], foods[j])) {
                activeSquares[i].size += Math.sqrt(4);
                foods.splice(j, 1);
            }
        }
    }


    // Update and draw squares
    activeSquares.forEach(square => {
        square.move();
        square.draw(ctx);
    });

    // Update and draw particles
    particles.forEach((particle, index) => {
        particle.move();
        particle.draw(ctx);
        if (particle.lifetime <= 0) {
            particles.splice(index, 1);
        }
    });
    //update and draw food
    foods.forEach(food => {
        food.draw(ctx);
    });


    requestAnimationFrame(updateCanvas);
}

// Event listeners
document.querySelector('.start').addEventListener('click', function () {
    gameRunning = true;
    updateCanvas();
});

document.querySelector('.stop').addEventListener('click', function () {
    gameRunning = false;
});

document.querySelector('.add-square').addEventListener('click', function () {
    initialiseSquare();
});
document.querySelector('.add-food').addEventListener('click', function () {
    for (let i = 0; i < 50; i++) {
        initialiseFood();
    }
    initialiseFood();
});
document.querySelector('.increase-size').addEventListener('click', function () {
    squares.forEach(square => (square.size += 10));
});
document.querySelector('.back').addEventListener('click', function () {
    squares.forEach(square => (square.size += 10));
});

// Initialize a few squares to start
for (let i = 0; i < 3; i++) {
    initialiseSquare();
}
//initialize a few food to start



for (let i = 0; i < 1000; i++) {
    initialiseFood();
}