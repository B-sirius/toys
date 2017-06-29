'use strict';

'use strict';
window.requestAnimationFrame = window.requestAnimationFrame || function(fn) {
    setTimeout(fn, 17);
};

// 渲染背景
let renderBackground = (() => {
    let canvas = document.getElementById('spaceCanvas');

    let ctx = canvas.getContext('2d');

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    let stars = {};

    let LittleStar = function() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 1 + Math.random() * 2;
        this.speedX = 0.1 * Math.random();
        this.shineSpeed = 0.01 * Math.random();
        this.maxBrightness = 0.3 + Math.random() * 0.5;
        this.brightness = 0;
    }

    LittleStar.prototype.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
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
                if (stars[i].x > canvas.width) {
                    stars[i].x = 0 - 2 * stars[i].radius;
                }

                stars[i].draw();
            }
        }

        let render = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawStars();

            requestAnimationFrame(render);
        }

        render();
    })();
})();



