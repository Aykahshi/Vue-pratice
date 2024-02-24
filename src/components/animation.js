const rains = document.getElementById("rain");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const raindrops = [];

class Raindrop {
	constructor() {
		this.x = Math.random() * rains.width;
		this.y = 0;
		this.speed = 2 + Math.random() * 2;
		this.length = 10 + Math.random() * 10;
		this.thickness = 2 + Math.random() * 2;
	}

	fall() {
		this.y += this.speed;
		if (this.y > rains.height) {
			this.y = 0;
			this.x = Math.random() * canvas.width;
		}
	}

	draw() {
		ctx.strokeStyle = "blue";
		ctx.lineWidth = this.thickness;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x, this.y + this.length);
		ctx.stroke();
	}
}

function createRaindrops() {
	for (let i = 0; i < 100; i++) {
		raindrops.push(new Raindrop());
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, rains.height);

	for (let i = 0; i < raindrops.length; i++) {
		raindrops[i].fall();
		raindrops[i].draw();
	}

	requestAnimationFrame(animate);
}

createRaindrops();
animate();
