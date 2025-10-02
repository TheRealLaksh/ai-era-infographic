class GradientAnimation {
    constructor() {
        this.cnv = document.querySelector(`#gradient-canvas`);
        this.ctx = this.cnv.getContext(`2d`);
        this.circles = [];
        this.resize();
        window.addEventListener(`resize`, this.resize.bind(this));
        this.init();
    }
    resize() {
        this.w = this.cnv.width = window.innerWidth;
        this.h = this.cnv.height = window.innerHeight;
    }
    init() {
        const colors = [`#38bdf8`, `#c084fc`, `#f471b5`];
        const circleCount = 3;
        for (let i = 0; i < circleCount; i++) {
            this.circles.push(new Circle(this.w, this.h, colors[i]));
        }
        this.animate();
    }
    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.circles.forEach(circle => circle.update(this.ctx));
        requestAnimationFrame(this.animate.bind(this));
    }
}

class Circle {
    constructor(w, h, color) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = w * 0.4 + Math.random() * w * 0.2;
        this.speed = 0.02;
        this.color = color;
    }
    update(ctx) {
        this.angle += this.speed;
        const x = this.x + Math.cos(this.angle) * 100;
        const y = this.y + Math.sin(this.angle) * 100;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, `${this.color}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

new GradientAnimation();