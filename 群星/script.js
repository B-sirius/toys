'use strict';
window.requestAnimationFrame = window.requestAnimationFrame || function(fn) {
    setTimeout(fn, 17);
};

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

let renderMain = (() => {
    let canvas = document.getElementById('starCanvas');
    let ctx = canvas.getContext('2d');

    let Star = function(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    Star.prototype.draw = function() {
        let a = this.x;
        let b = this.y;
        let r = this.radius;

        // 六芒星的六个顶点在画布上的坐标
        let arrPos = [
            [a + r * Math.cos(0), b + r * Math.sin(0)],
            [a + r * Math.cos(Math.PI * 2 / 3), b + r * Math.sin(Math.PI * 2 / 3)],
            [a + r * Math.cos(Math.PI * 2 / -3), b + r * Math.sin(Math.PI * 2 / -3)],
            [a + r * Math.cos(Math.PI / 3), b + r * Math.sin(Math.PI / 3)],
            [a + r * Math.cos(Math.PI / -3), b + r * Math.sin(Math.PI / -3)],
            [a + r * Math.cos(Math.PI), b + r * Math.sin(Math.PI)]
        ]

        // 绘制两个三角形，重叠即是六芒星
        ctx.beginPath();
        ctx.moveTo(arrPos[0][0], arrPos[0][1]);
        ctx.lineTo(arrPos[1][0], arrPos[1][1]);
        ctx.lineTo(arrPos[2][0], arrPos[2][1]);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(arrPos[3][0], arrPos[3][1]);
        ctx.lineTo(arrPos[4][0], arrPos[4][1]);
        ctx.lineTo(arrPos[5][0], arrPos[5][1]);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    let switchStars = (() => {
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;

        let posArr = [{
            pos: [
                [centerX + 9, centerY - 89],
                [centerX + 64, centerY - 100],
                [centerX + 95, centerY - 67],
                [centerX + 100, centerY - 20],
                [centerX + 76, centerY + 15],
                [centerX + 37, centerY + 37],
                [centerX - 25, centerY + 62],
                [centerX - 60, centerY + 20],
                [centerX - 80, centerY - 24],
                [centerX - 85, centerY - 68],
                [centerX - 67, centerY - 109],
                [centerX - 28, centerY - 123]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "8-7", "9-8", "10-9", "11-10", "12-11", "12-1"]
        }, {
            pos: [
                [centerX + 46, centerY - 127],
                [centerX + 39, centerY - 84],
                [centerX + 32, centerY - 39],
                [centerX + 23, centerY + 17],
                [centerX + 14, centerY + 59],
                [centerX - 30, centerY + 30],
                [centerX - 60, centerY - 26],
                [centerX - 52, centerY - 68],
                [centerX - 9, centerY - 111],
                [centerX - 111, centerY - 64],
                [centerX + 78, centerY - 30],
                [centerX + 108, centerY - 55],
                [centerX + 100, centerY + 1]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "8-7", "9-8", "9-1", "11-10", "12-11", "13-11"]
        }, {
            pos: [
                [centerX + 68, centerY - 41],
                [centerX + 61, centerY - 93],
                [centerX - 7, centerY - 124],
                [centerX - 57, centerY - 113],
                [centerX - 66, centerY - 71],
                [centerX - 20, centerY - 42],
                [centerX + 35, centerY - 15],
                [centerX + 51, centerY + 27],
                [centerX + 3, centerY + 55],
                [centerX - 53, centerY + 42],
                [centerX - 75, centerY + 1],
                [centerX + 36, centerY - 141],
                [centerX - 37, centerY + 75]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "8-7", "9-8", "10-9", "11-10", "13-12"]
        }, {
            pos: [
                [centerX - 12, centerY - 138],
                [centerX + 51, centerY - 107],
                [centerX + 69, centerY - 46],
                [centerX + 46, centerY + 24],
                [centerX + 46, centerY + 75],
                [centerX - 26, centerY + 84],
                [centerX - 40, centerY + 26],
                [centerX - 80, centerY - 35],
                [centerX - 70, centerY - 100],
                [centerX + 5, centerY + 25],
                [centerX + 3, centerY - 12],
                [centerX + 33, centerY - 35],
                [centerX - 38, centerY - 40],
                [centerX + 0, centerY - 64]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "8-7", "9-8", "9-1", "10-4", "10-7", "11-10", "12-11", "13-12", "14-13"]
        }, {
            pos: [
                [centerX - 28, centerY - 129],
                [centerX + 7, centerY - 108],
                [centerX + 48, centerY - 109],
                [centerX + 64, centerY - 64],
                [centerX + 48, centerY - 30],
                [centerX + 53, centerY + 8],
                [centerX + 26, centerY + 39],
                [centerX - 29, centerY + 48],
                [centerX - 57, centerY + 17],
                [centerX - 97, centerY + 7],
                [centerX - 106, centerY - 43],
                [centerX - 80, centerY - 76],
                [centerX - 77, centerY - 116],
                [centerX - 20, centerY - 42],
                [centerX + 98, centerY + 66]
            ],
            line: ["2-1", "3-2", "5-4", "6-5", "9-8", "10-9", "12-11", "13-12", "14-1", "14-3", "14-4", "14-6", "14-7", "14-8", "14-10", "14-11", "14-13", "15-7"]
        }, {
            pos: [
                [centerX - 5, centerY - 132],
                [centerX - 9, centerY - 76],
                [centerX + 66, centerY - 90],
                [centerX + 51, centerY - 40],
                [centerX + 4, centerY + 12],
                [centerX - 49, centerY - 19],
                [centerX - 93, centerY - 72],
                [centerX - 47, centerY + 73],
                [centerX + 79, centerY + 50]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "7-2", "8-5", "9-5"]
        }];

        let ElasticEaseOut = function(t, b, c, d, a, p) {
            let s;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }

        let drawLine = function(x1, y1, x2, y2) {
            ctx.beginPath();
            ctx.setLineDash([2, 2]);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }

        let render = (() => {
            let duration = 100; // 动画过程帧数

            let index = 0; // 当前形状序号

            let curr = 0; // 当前帧数

            let stars = [];

            let pos; // 位置坐标
            let line; // 连线关系

            let update = function() {
                pos = posArr[index].pos;
                line = posArr[index].line;

                line = line.map((item) => {
                    return item.split('-');
                });

                stars = [];
                pos.forEach((item) => {
                    let star = new Star(0, 0, 5 + 5 * Math.random());
                    stars.push(star);
                });
            }

            // 图案展开
            let start = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                pos.forEach((item, i) => {
                    let x = ElasticEaseOut(curr, centerX, item[0] - centerX, duration);
                    let y = ElasticEaseOut(curr, centerY, item[1] - centerY, duration);

                    stars[i].x = x;
                    stars[i].y = y;

                    stars[i].draw();
                });

                line.forEach((item) => {
                    let from = item[0] - 1;
                    let to = item[1] - 1;

                    drawLine(stars[from].x, stars[from].y, stars[to].x, stars[to].y);
                })

                curr++;

                if (curr > duration) {
                    last();
                    return;
                }

                requestAnimationFrame(start);
            }

            // 图案保持
            let last = function() {
                setTimeout(() => {
                    curr = 0;
                    end();
                }, 1500);
            }

            // 图案收缩
            let end = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                pos.forEach((item, i) => {
                    let x = ElasticEaseOut(curr, item[0], centerX - item[0], duration);
                    let y = ElasticEaseOut(curr, item[1], centerY - item[1], duration);

                    stars[i].x = x;
                    stars[i].y = y;

                    stars[i].draw();
                });

                line.forEach((item) => {
                    let from = item[0] - 1;
                    let to = item[1] - 1;

                    drawLine(stars[from].x, stars[from].y, stars[to].x, stars[to].y);
                })

                curr++;

                if (curr > duration) {
                    index++;
                    if (index >= posArr.length) {
                        index = 0;
                    }
                    curr = 0;
                    update();

                    start();
                    return;
                }

                requestAnimationFrame(end);
            }

            update();
            start();
        })();
    })();
})();
