    // Canvas setup
    const canva = document.querySelector('canvas');
    canva.style.border = '1px solid black';
    const ctx = canva.getContext('2d');
    canva.width = 2000;
    canva.height = 1000;

    // Game state
    let gameRunning = false;

    // Random color list
    const colorlist = Array.from({ length: 100 }, () =>
        `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    );

    // Particle class

    // Square class
    class Square {
        constructor(x, y, size, color, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
        }
        move() {
            

            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off walls and decrease size
            if (this.y + this.size > canva.height || this.y < 0) {
                this.speedY = -this.speedY;

            }

        }

        draw(ctx) {
            
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.size, this.size); 
        }

    
    }
    class rectangle {
        constructor(x, y, width, height, color, speedX, speedY,text) {
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.width = width;
            this.height = height;
            this.color = color;
            this.text = text;
        }
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'red';
            ctx.font = '30px Arial';
            ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

        } 
        move(){
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y + this.height > canva.height || this.y < 0) {
                this.speedY = 0;
            }
            if (this.x + this.width > canva.width || this.x < 0) {
                this.speedX = 0;}
            
        }
        
    }
    // Game entities
    particles = [];
    lefthammer = new rectangle(0, 0, 50, 100, 'black', 0, 0,'S');
    righthammer = new rectangle(canva.width-50, 0, 50, 100, 'black', 0, 0,'M');
    secondarylefthammer = new rectangle(0, 0, 0, 0, 'black', 0, 0,'S');
    secondaryrighthammer = new rectangle(canva.width - 600, 0, 0, 0, 'black', 0, 0,'M');
    const board = canva.getContext('2d');
    scoreleft = 0;
    scoreright = 0;
    randomx = Math.floor(Math.random() * 1000);
    randomy = Math.floor(Math.random() * 1000);
    square = new Square(randomx, randomy, 50, 'green', 5, 5);

    // Function to detect collision between two squares
    function checkCollision(square, rectangle) {
        return (
            square.x < rectangle.x + rectangle.width &&
            square.x + square.size > rectangle.x &&
            square.y < rectangle.y + rectangle.height &&
            square.y + square.size > rectangle.y
        );
    }
    function movement(event){
        if(event.key === 'z'){
            lefthammer.speedY = -20;
        }
        if(event.key === 's'){
            lefthammer.speedY = 20;
        }
        if(event.key === 'i'){
            righthammer.speedY = -20;
        }
        if(event.key === 'k'){
            righthammer.speedY = 20;
        }
        if(event.key ==='e'){
            secondarylefthammer.speedY = -5;
        }
        if(event.key === 'd'){
            secondarylefthammer.speedY = 5;
        }
        if(event.key === 'o'){
            secondaryrighthammer.speedY = -5;
        }
        if(event.key === 'l'){
            secondaryrighthammer.speedY = 5;
        }
        if(event.key === 'g'){
            scoreleft += 1;
        }
        if(event.key === 'x'){
            //toggle game running
            gameRunning = !gameRunning;
            updateCanvas();

        }
        
    }

    // Update canvas
    function updateCanvas() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canva.width, canva.height);
            square.move();
            square.draw(ctx);
            lefthammer.move();
            secondarylefthammer.move();
            
            lefthammer.draw(ctx);
            secondarylefthammer.draw(ctx);
            righthammer.move();
            secondaryrighthammer.move();
            righthammer.draw(ctx);
            secondaryrighthammer.draw(ctx);

            board.fillStyle = 'black';
            board.textAlign = 'center';
            board.font = '30px Arial';
            board.fillText('PONG', 1000, 50);
            board.fillText(scoreleft + ' - ' + scoreright, 1000, 100);
            //add score left if hit right wall
            if (square.x + square.size > canva.width) {
                square.move();
                square.draw(ctx);
                square.x = 1000;
                square.y = 500;
                scoreleft += 1;
                gameRunning = false;
                square.speedX = -7;
                square.speedY = 1;
            }
            //add score right if hit left wall
            if (square.x < 0) {
                square.move();
                square.draw(ctx);
                square.x = 1000;
                square.y = 500;
                scoreright += 1;
                gameRunning = false;
                square.speedX = 7;
                square.speedY = 1;
                

            }
            
            
            if (checkCollision(square, lefthammer)) {
                // Reflect horizontally and adjust vertical speed based on hammer's vertical speed
                square.speedX = Math.abs(square.speedX)+2;  // Ensure the square goes right after hitting the left hammer
                square.speedY += lefthammer.speedY/2;  // Add the hammer's vertical speed to the square
                square.x = lefthammer.x + lefthammer.width;  // Move square to the right of the hammer to avoid overlap
            }
        
            if (checkCollision(square, righthammer)) {
                // Reflect horizontally and adjust vertical speed based on hammer's vertical speed
                square.speedX = -Math.abs(square.speedX)+2;  // Ensure the square goes left after hitting the right hammer
                square.speedY += righthammer.speedY/2;  // Add the hammer's vertical speed to the square
                square.x = righthammer.x - square.size;  // Move square to the left of the hammer to avoid overlap
            }
            if(checkCollision(square,secondarylefthammer)){
                square.speedX = Math.abs(square.speedX);
                square.speedY += secondarylefthammer.speedY;
                square.x = secondarylefthammer.x + secondarylefthammer.width;
            }
            if(checkCollision(square,secondaryrighthammer)){
                square.speedX = -Math.abs(square.speedX);
                square.speedY += secondaryrighthammer.speedY;
                square.x = secondaryrighthammer.x - square.size;
            }
            if(scoreleft === 10){
                board.fillText('Player 1 wins', 1000, 150);
                gameRunning = false;
            }
            if(scoreright === 10){
                board.fillText('Player 2 wins', 1000, 150);
                gameRunning = false;
            }


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
    document.addEventListener('keydown', function (e) {
        movement(e);
    });
    // Initial setup

