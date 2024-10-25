const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

// Clase Circle con propiedades y métodos
class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color; // Guardar el color original
        this.text = text;
        this.speed = speed;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
        this.flashFrames = 0; // Inicializar flashFrames
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        // Actualizar la posición X
        this.posX += this.dx;
        // Cambiar la dirección si el círculo llega al borde del canvas en X
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        // Actualizar la posición Y
        this.posY += this.dy;
        // Cambiar la dirección si el círculo llega al borde del canvas en Y
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
        if (this.flashFrames > 0) {
            this.flashFrames--;
            if (this.flashFrames === 0) {
                this.color = this.originalColor;
            }
        }
    }

    // Método para detectar colisiones con otro círculo
    isCollidingWith(otherCircle) {
        const distX = this.posX - otherCircle.posX;
        const distY = this.posY - otherCircle.posY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < this.radius + otherCircle.radius;
    }

    handleCollision() {
        this.dx = -this.dx;            
        this.dy = -this.dy;
        this.color = "#0000FF";
        this.flashFrames = 5;
    }

    // Método para detectar si el mouse está dentro del círculo
    isMouseInside(mouseX, mouseY) {
        const distX = mouseX - this.posX;
        const distY = mouseY - this.posY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < this.radius;
    }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Color aleatorio
        let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
        let text = `C${i + 1}`; // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para detectar colisiones entre círculos
function detectCollisions() {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].isCollidingWith(circles[j])) {
                circles[i].handleCollision();
                circles[j].handleCollision();
            }
        }
    }
}

// Función para eliminar un círculo en el clic del mouse
function removeCircle(mouseX, mouseY) {
    circles = circles.filter(circle => !circle.isMouseInside(mouseX, mouseY));
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas

    // Verificar colisiones y actualizar círculos
    circles.forEach(circle => {
        circle.update(ctx);
    });
    detectCollisions();
    requestAnimationFrame(animate); // Repetir la animación
}

// Manejar clic del mouse
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Obtener coordenada X relativa al canvas
    const mouseY = event.clientY - rect.top;  // Obtener coordenada Y relativa al canvas
    removeCircle(mouseX, mouseY);
});

// Generar N círculos y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();
