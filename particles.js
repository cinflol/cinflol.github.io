const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const toggleParticles = document.getElementById("toggleParticles");
const toggleGravityBalls = document.getElementById("toggleGravityBalls");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let gravityBallsArray = [];
const numberOfParticles = 100;
const numberOfGravityBalls = 100;
let particlesEnabled = false;
let gravityBallsEnabled = false;
let lastWindowX = window.screenX; // Track the window position
let lastWindowY = window.screenY; // Track the window position
let mouseX = 0;
let mouseY = 0;

// Class for gravity balls
class GravityBall {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height / 2;
    this.size = Math.random() * 10 + 5;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.2; // Simulated gravity
    this.friction = 0.98; // Slow down over time
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  // Method to apply repulsion force when balls interact
  interactWithOtherBalls(balls) {
    for (let i = 0; i < balls.length; i++) {
      const otherBall = balls[i];
      if (otherBall === this) continue; // Don't interact with itself

      const dx = this.x - otherBall.x;
      const dy = this.y - otherBall.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If the distance is less than the sum of their sizes, apply repulsion
      if (distance < this.size + otherBall.size) {
        const angle = Math.atan2(dy, dx);
        const force = (this.size + otherBall.size - distance) * 0.5; // Repulsion strength

        // Apply repulsion force to both balls
        this.speedX += Math.cos(angle) * force;
        this.speedY += Math.sin(angle) * force;

        otherBall.speedX -= Math.cos(angle) * force;
        otherBall.speedY -= Math.sin(angle) * force;
      }
    }
  }

  // Method to apply repulsion force from mouse
  interactWithMouse() {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If the mouse is close to the ball, apply repulsion force
    if (distance < 200) { // Only apply repulsion if within 200px
      const angle = Math.atan2(dy, dx);
      const force = (200 - distance) * 0.1; // Repulsion strength based on proximity

      // Apply repulsion force to the ball
      this.speedX += Math.cos(angle) * force;
      this.speedY += Math.sin(angle) * force;
    }
  }

  update(tiltX, tiltY, balls) {
    this.speedY += this.gravity + tiltY; // Gravity + window tilt
    this.speedX += tiltX; // Tilt for horizontal movement

    this.x += this.speedX;
    this.y += this.speedY;

    // Interact with other balls
    this.interactWithOtherBalls(balls);

    // Interact with the mouse
    this.interactWithMouse();

    // Bounce off edges
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.speedX *= -0.8; // Reverse direction with some energy loss
      this.x = Math.min(Math.max(this.x, this.size), canvas.width - this.size);
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.speedY *= -0.8; // Reverse direction with some energy loss
      this.y = Math.min(Math.max(this.y, this.size), canvas.height - this.size);
    }

    // Apply friction
    this.speedX *= this.friction;
    this.speedY *= this.friction;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initGravityBalls() {
  gravityBallsArray = [];
  for (let i = 0; i < numberOfGravityBalls; i++) {
    gravityBallsArray.push(new GravityBall());
  }
}

function animateGravityBalls() {
  if (gravityBallsEnabled) {
    const tiltX = (window.screenX - lastWindowX) * 0.05; // Calculate window movement
    const tiltY = (window.screenY - lastWindowY) * 0.05;

    lastWindowX = window.screenX;
    lastWindowY = window.screenY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gravityBallsArray.forEach((ball) => {
      ball.update(tiltX, tiltY, gravityBallsArray); // Pass all balls for interaction
      ball.draw();
    });
    requestAnimationFrame(animateGravityBalls);
  }
}

function toggleGravityBallsEffect() {
  gravityBallsEnabled = toggleGravityBalls.checked;

  if (gravityBallsEnabled) {
    canvas.style.display = "block";
    if (!gravityBallsArray.length) initGravityBalls(); // Only initialize once
    animateGravityBalls();
  } else {
    canvas.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Mouse event listener to track mouse position
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

toggleGravityBalls.addEventListener("change", toggleGravityBallsEffect);
