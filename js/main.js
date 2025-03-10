const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = 300;
const window_width = getComputedStyle(canvas).width.slice(0, -2);

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

// Crear un objeto de sonido
const collisionSound = new Audio('assets/bounce.mp3'); // Cambia por la URL del sonido si lo prefieres

// Controlar la frecuencia de reproducción del sonido para evitar la sobrecarga
let canPlaySound = true;

// Restante código del juego...

class Circle {
    constructor(x, y, radius, color, text, speedX, speedY) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.dx = speedX;
        this.dy = speedY;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();

        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
    }

    update() {
        if (this.posX + this.radius >= window_width || this.posX - this.radius <= 0) {
            this.dx = -this.dx;
            this.posX = this.posX + this.radius >= window_width ? window_width - this.radius : this.radius;
        }

        if (this.posY + this.radius >= window_height || this.posY - this.radius <= 0) {
            this.dy = -this.dy;
            this.posY = this.posY + this.radius >= window_height ? window_height - this.radius : this.radius;
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function detectCollision(circle1, circle2) {
    let dx = circle2.posX - circle1.posX;
    let dy = circle2.posY - circle1.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= circle1.radius + circle2.radius;
}

function resolveCollision(circle1, circle2) {
    let dx = circle2.posX - circle1.posX;
    let dy = circle2.posY - circle1.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    let overlap = circle1.radius + circle2.radius - distance;
    let normalizeX = dx / distance;
    let normalizeY = dy / distance;

    circle1.posX -= normalizeX * overlap / 2;
    circle1.posY -= normalizeY * overlap / 2;
    circle2.posX += normalizeX * overlap / 2;
    circle2.posY += normalizeY * overlap / 2;

    let tempDx = circle1.dx;
    let tempDy = circle1.dy;
    circle1.dx = circle2.dx;
    circle1.dy = circle2.dy;
    circle2.dx = tempDx;
    circle2.dy = tempDy;
}

let circles = [];

const numCircles =  parseInt(prompt("Introduce el número de círculos a dibujar:"));


for (let i = 0; i < numCircles; i++) {
    let radius = Math.floor(Math.random() * 30) + 20;
    let posX = Math.floor(Math.random() * (window_width - radius * 2)) + radius;
    let posY = Math.floor(Math.random() * (window_height - radius * 2)) + radius;
    let speedX = Math.floor(Math.random() * 6) + 2;
    let speedY = Math.floor(Math.random() * 6) + 2;
    let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    let text = `${i + 1}`;

    circles.push(new Circle(posX, posY, radius, color, text, speedX, speedY));
}

function updateCircle() {
    requestAnimationFrame(updateCircle);
    ctx.clearRect(0, 0, window_width, window_height);

    circles.forEach(circle => circle.update());

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (detectCollision(circles[i], circles[j])) {
                circles[i].color = circles[i].color === "red" ? "green" : "red";
                circles[j].color = circles[j].color === "red" ? "green" : "red";

                resolveCollision(circles[i], circles[j]);

                // Reproducir el sonido de colisión solo si es posible
                if (canPlaySound) {
                    collisionSound.play();
                    canPlaySound = false;

                    // Volver a habilitar la reproducción después de un corto retardo
                    setTimeout(() => {
                        canPlaySound = true;
                    }, 200); // Ajusta el tiempo para evitar que se repita demasiado rápido
                }
            }
        }
    }

    circles.forEach(circle => circle.draw(ctx));
}

updateCircle();
