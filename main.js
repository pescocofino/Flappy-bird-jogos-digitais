const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocityY: 0,
    gravity: 0.6,
    lift: -12,
    draw: function() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }
    }
};

const pipes = [];
const pipeWidth = 60;
const pipeGap = 120;
const pipeSpeed = 2;
let frameCount = 0;
let score = 0;

function createPipe() {
    const pipeHeight = Math.random() * (canvas.height - pipeGap - 50) + 25;
    pipes.push({
        x: canvas.width,
        width: pipeWidth,
        height: pipeHeight,
        gap: pipeGap,
        passed: false
    });
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + pipe.gap, pipe.width, canvas.height);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
        }
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
        }
    });
}

function checkCollision() {
    return pipes.some(pipe => {
        return bird.x < pipe.x + pipe.width &&
               bird.x + bird.width > pipe.x &&
               (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipe.gap);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bird.draw();
    bird.update();

    if (frameCount % 90 === 0) {
        createPipe();
    }

    drawPipes();
    updatePipes();
    drawScore();

    if (checkCollision()) {
        alert('Game Over! Your score: ' + score);
        document.location.reload();
    }

    frameCount++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        bird.velocityY = bird.lift;
    }
});

gameLoop();
