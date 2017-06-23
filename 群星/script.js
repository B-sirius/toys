'use strict';
window.requestAnimationFrame = window.requestAnimationFrame || function(fn) {
    setTimeout(fn, 17);
};

let spaceCanvas = document.getElementById('spaceCanvas');

let spaceCtx = spaceCanvas.getContext('2d');

spaceCanvas.width = document.body.clientWidth;
spaceCanvas.height = document.body.clientHeight;

let stars = {};

let LittleStar = function() {
    this.x = Math.random() * spaceCanvas.width;
    this.y = Math.random() * spaceCanvas.height;
    this.radius = 1 + Math.random() * 2;
    this.speedX = 0.1 * Math.random();
    this.shineSpeed = 0.01 * Math.random();
    this.maxBrightness = 0.3 + Math.random() * 0.5;
    this.brightness = 0;
}

LittleStar.prototype.draw = function() {
    spaceCtx.beginPath();
    spaceCtx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
    spaceCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    spaceCtx.closePath();
    spaceCtx.fill();
}

LittleStar.prototype.shine = function() {
    let t = this.brightness + this.shineSpeed;
    if (t > 1 || t < 0) {
        this.shineSpeed = -this.shineSpeed;
    }

    this.brightness += this.shineSpeed;
}

let initSpaceCanvas = (() => {
    for (let i = 0; i < 100; i++) {
        stars[i] = new LittleStar();
    }

    let drawStars = function() {
        for (let i in stars) {
            // 亮度变化
            stars[i].shine();

            // 位置变化
            stars[i].x += stars[i].speedX;
            if (stars[i].X > spaceCanvas.width) {
                stars[i].x = 0 - 2 * stars[i].radius;
            }

            stars[i].draw();
        }
    }

    let render = function() {
        spaceCtx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);
        drawStars();

        requestAnimationFrame(render);
    }

    render();
})();
