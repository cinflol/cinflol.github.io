const bouncyCanvas = document.getElementById('bouncyBalls');
const bouncyCtx = bouncyCanvas.getContext('2d');
const balls = [];

bouncyCanvas.width = window.innerWidth;
bouncyCanvas.height = window.innerHeight;

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 20 + 10;
    this.dx = (Math.random() - 0.5) * 4;
    this.dy = (Math.random() - 0.5) * 4;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
  }

  update() {
    if (this.x + this.radius > bouncyCanvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > bouncyCanvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }

  draw() {
    bouncyCtx.beginPath();
    bouncyCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    bouncyCtx.fillStyle = this.color;
    bouncyCtx.fill();
    bouncyCtx.closePath();
  }
}

function addBall() {
  const x = Math.random() * bouncyCanvas.width;
  const y = Math.random() * bouncyCanvas.height;
  balls.push(new Ball(x, y));
}

let animationId = null;

function animate() {
  bouncyCtx.clearRect(0, 0, bouncyCanvas.width, bouncyCanvas.height);
  balls.forEach(ball => ball.update());
  animationId = requestAnimationFrame(animate);
}

// Get the existing toggleGravityBalls element
const toggleGravityBalls = document.getElementById('toggleGravityBalls');

function startBalls() {
  if (balls.length === 0) {
    // Add initial balls
    for (let i = 0; i < 10; i++) {
      addBall();
    }
  }
  animate();
  // Add a new ball every second
  setInterval(addBall, 1000);
}

function stopBalls() {
  cancelAnimationFrame(animationId);
  balls.length = 0;
  bouncyCtx.clearRect(0, 0, bouncyCanvas.width, bouncyCanvas.height);
}

// Remove any existing event listeners
toggleGravityBalls.removeEventListener('change', toggleGravityBallsHandler);

// Add the new event listener
function toggleGravityBallsHandler() {
  if (this.checked) {
    startBalls();
  } else {
    stopBalls();
  }
}

toggleGravityBalls.addEventListener('change', toggleGravityBallsHandler);

window.addEventListener('resize', function() {
  bouncyCanvas.width = window.innerWidth;
  bouncyCanvas.height = window.innerHeight;
});

// Initialize based on the initial state of the checkbox
if (toggleGravityBalls.checked) {
  startBalls();
}
