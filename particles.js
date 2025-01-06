const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const toggleGravityBalls = document.getElementById("toggleGravityBalls");

const GRAVITY = 0.2;
const FRICTION = 0.98;
const REPULSION_DISTANCE = 200;
const REPULSION_STRENGTH = 0.1;
const EDGE_BOUNCE = -0.8;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravityBallsArray = [];
let gravityBallsEnabled = false;
let lastWindowX = window.screenX;
let lastWindowY = window.screenY;
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
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  interactWithMouse() {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < REPULSION_DISTANCE) {
      const angle = Math.atan2(dy, dx);
      const force = (REPULSION_DISTANCE - distance) * REPULSION_STRENGTH;

      this.speedX += Math.cos(angle) * force;
      this.speedY += Math.sin(angle) * force;
    }
  }

  interactWithOtherBalls(balls) {
    balls.forEach((otherBall) => {
      if (this === otherBall) return;

      const dx = this.x - otherBall.x;
      const dy = this.y - otherBall.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + otherBall.size) {
        const angle = Math.atan2(dy, dx);
        const force = (this.size + otherBall.size - distance) * 0.5;

        this.speedX += Math.cos(angle) * force;
        this.speedY += Math.sin(angle) * force;

        otherBall.speedX -= Math.cos(angle) * force;
        otherBall.speedY -= Math.sin(angle) * force;
      }
    });
  }

  update(tiltX, tiltY, balls) {
    this.speedY += GRAVITY + tiltY;
    this.speedX += tiltX;

    this.x += this.speedX;
    this.y += this.speedY;

    this.interactWithMouse();
    this.interactWithOtherBalls(balls);

    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.speedX *= EDGE_BOUNCE;
      this.x = Math.min(Math.max(this.x, this.size), canvas.width - this.size);
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.speedY *= EDGE_BOUNCE;
      this.y = Math.min(Math.max(this.y, this.size), canvas.height - this.size);
    }

    this.speedX *= FRICTION;
    this.speedY *= FRICTION;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initGravityBalls(count = 100) {
  gravityBallsArray = Array.from({ length: count }, () => new GravityBall());
}

function animateGravityBalls() {
  if (!gravityBallsEnabled) return;

  const tiltX = (window.screenX - lastWindowX) * 0.05;
  const tiltY = (window.screenY - lastWindowY) * 0.05;

  lastWindowX = window.screenX;
  lastWindowY = window.screenY;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gravityBallsArray.forEach((ball) => {
    ball.update(tiltX, tiltY, gravityBallsArray);
    ball.draw();
  });

  requestAnimationFrame(animateGravityBalls);
}

function toggleGravityBallsEffect() {
  gravityBallsEnabled = toggleGravityBalls.checked;

  if (gravityBallsEnabled) {
    canvas.style.display = "block";
    if (!gravityBallsArray.length) initGravityBalls();
    animateGravityBalls();
  } else {
    canvas.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function debounce(func, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Event Listeners
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener("resize", debounce(() => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}));

toggleGravityBalls.addEventListener("change", toggleGravityBallsEffect);
