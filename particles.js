const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// Configurazione ottimizzata
const CONFIG = {
    maxSize: 5,
    minSize: 1,
    maxSpeed: 2,
    connectionDistance: 100,
    lineWidth: 0.2,
    glowIntensity: 15,
    fadeSpeed: 0.05,
    colors: {
        dynamic: true,
        fixed: ['#ff0000', '#00ff00', '#0000ff']
    }
};

// Calcola il numero di particelle in base alla risoluzione dello schermo
function getOptimizedParticleCount() {
    const area = window.innerWidth * window.innerHeight;
    return Math.min(Math.floor(area / 6000), 5); // Massimo 150
}

// Inizializza dimensioni canvas
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

initCanvas();

let particlesArray = [];
let gravityEnabled = true;

// Particle class
class Particle {
    constructor() {
        this.reset();
        if (!CONFIG.colors.dynamic) {
            this.color = CONFIG.colors.fixed[Math.floor(Math.random() * CONFIG.colors.fixed.length)];
        }
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * CONFIG.maxSize + CONFIG.minSize;
        this.speedX = Math.random() * CONFIG.maxSpeed * 2 - CONFIG.maxSpeed;
        this.speedY = Math.random() * CONFIG.maxSpeed * 2 - CONFIG.maxSpeed;
        this.color = CONFIG.colors.dynamic
            ? `hsl(${Math.random() * 360}, 100%, 50%)`
            : this.color;
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > CONFIG.minSize) this.size -= CONFIG.fadeSpeed;
        if (this.opacity > 0.1) this.opacity -= CONFIG.fadeSpeed / 10;

        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        if (this.size <= CONFIG.minSize || this.opacity <= 0.1) {
            if (Math.random() < 0.005) this.reset(); // Reset meno frequente
        }
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Crea particelle
function initParticles() {
    const particleCount = getOptimizedParticleCount();
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

// Connessioni tra particelle ottimizzate
function drawConnections() {
    for (let i = 0; i < particlesArray.length; i++) {
        const a = particlesArray[i];
        for (let j = i + 1; j < particlesArray.length && j < i + 20; j++) {
            const b = particlesArray[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.connectionDistance) {
                const opacity = 1 - (distance / CONFIG.connectionDistance);
                ctx.beginPath();
                ctx.strokeStyle = a.color;
                ctx.lineWidth = CONFIG.lineWidth;
                ctx.globalAlpha = opacity * 0.7;
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

// Loop animazione ottimizzato a 30 FPS
let lastTime = 0;
function animate(now) {
    if (now - lastTime < 1000 / 30) {
        requestAnimationFrame(animate);
        return;
    }
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gravityEnabled) {
        for (const particle of particlesArray) {
            ctx.shadowBlur = CONFIG.glowIntensity;
            ctx.shadowColor = particle.color;
            particle.update();
            particle.draw();
        }

        drawConnections();
    }

    requestAnimationFrame(animate);
}

// Resize + recalcolo particelle
window.addEventListener('resize', () => {
    initCanvas();
    initParticles();
});

// Toggle attiva/disattiva
document.querySelector('.toggles label').addEventListener('click', function () {
    gravityEnabled = !gravityEnabled;
    canvas.style.display = gravityEnabled ? 'block' : 'none';
});

// Tasto H
document.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() === 'h') {
        const newWindow = window.open('https://www.w3schools.com/cpp/cpp_files.asp', '_blank');
        if (newWindow) {
            window.close();
        } else {
            alert('Impossibile aprire w3schools. Potrebbe essere bloccato dal popup blocker.');
        }
    }
});

// Inizializzazione
initParticles();
animate();
