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

// 初始化对话系统
let initQA = (() => {
    let isChoice = false;

    let textContainer = document.getElementById('textContainer');
    let choiceList = document.getElementById('choiceList');

    let renderText = function(text) {
        let textNode = document.createElement('p');
        textNode.className = 'text';
        textContainer.appendChild(textNode);

        text = text.split('');
        let interval = setInterval(() => {
            if (text.length === 0) {
                clearInterval(interval);
                return;
            }
            let letter = text.shift();
            textNode.innerHTML += letter;
        }, 50);
    };

    // 测试数据
    let testData = [
        {
            type: 'choice',
            text: 'what are u looking at bro?',
            choices: [{
                choiceText: 'A. dog',
                text: 'Yep.'
            }, {
                choiceText: 'B. god',
                text: 'Sorry, but god has his girl.'
            }, {
                choiceText: 'C. cat',
                text: 'A cat with a dog face, that\'s cool'
            }, {
                choiceText: 'D. sirius',
                text: 'Seriously, u know who i am?'
            }]
        }, {
            type: 'text',
            text: 'Ok, kid, so what we are going to do?'
        }, {
            type: 'text',
            text: 'Cant speak? Fine. Good.'
        }
    ];

    let dataHandler = {
        text: function(data) {
            isChoice = false;

            choiceList.style.display = 'none';

            textContainer.innerHTML = '';

            renderText(data.text);
        },
        choice: function(data) {
            isChoice = true;

            renderText(data.text);

            let fragment = document.createDocumentFragment();

            data.choices.forEach((choice, index) => {
                let li = document.createElement('li');

                let choiceNode = document.createElement('a');

                choiceNode.tabIndex = index + 1;
                choiceNode.className = 'choice';

                let choiceText = document.createTextNode(choice.choiceText);

                choiceNode.appendChild(choiceText);
                li.appendChild(choiceNode);
                fragment.appendChild(li);

                choiceNode.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    dataHandler.text(choice);
                });
            });

            choiceList.appendChild(fragment);

            choiceList.display = 'block';
        }
    }

    let showData = function() {
        let data = testData.shift();
        dataHandler[data.type](data);
    }

    let initListener = (() => {
        const SPACE_KEYCODE = 32;
        const ENTER_KEYCODE = 13;

        let nextData = function(e) {
            if ((e.type === 'click' || e.keyCode === SPACE_KEYCODE) && !isChoice) {
                if (testData.length === 0) {
                    document.body.removeEventListener('keydown', nextData);
                    document.body.removeEventListener('click', nextData);
                    return;
                }

                showData();
            }
        }
        document.body.addEventListener('keydown', nextData);
        document.body.addEventListener('click', nextData);

        let makeChoice = function(e) {
            if (isChoice && e.keyCode === ENTER_KEYCODE) {
                let el = document.activeElement;
                if (el.className = 'choice') {
                    el.click();
                }
            }
        }
        document.body.addEventListener('keydown', makeChoice);
    })();

    showData();
})();
