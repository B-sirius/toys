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
    let data = [{
        type: 'choice',
        text: 'what are u looking at bro?',
        choiceList: [{
            text: 'A. dog',
            answer: 'Yep.'
        }, {
            text: 'B. god',
            answer: 'Sorry, but god has his girl.'
        }, {
            text: 'C. cat',
            answer: 'A cat with a dog face, that\'s cool'
        }, {
            text: 'D. sirius',
            answer: 'Seriously, u know who i am?'
        }]
    }, {
        type: 'text',
        text: 'Ok, kid, so what we are going to doooooooooooooooooooo?'
    }, {
        type: 'text',
        text: 'Opppppppppppppppppppppppppppps, that wont happen :).'
    }];

    let textView = {
        init: function() {
            this.container = document.getElementById('textContainer');
            this.interval = null;
        },
        /**
         * 一个个字母地渲染
         * @param  string   text 需要渲染的字符串
         */
        render: function(text) {
            controller.setRenderState('rendering'); // 设置controller的render状态
            controller.setCurrText(text); // 设置controller当前正在渲染的文本

            let textNode = document.createElement('p');
            textNode.className = 'text';
            this.container.appendChild(textNode);

            text = text.split('');
            this.interval = setInterval(() => {
                if (text.length === 0) {
                    clearInterval(this.interval);
                    this.interval = null;

                    controller.setRenderState('done'); // 设置controller的render状态

                    return;
                }
                let letter = text.shift();
                textNode.innerHTML += letter;
            }, 50);
        },
        // 直接呈现整句话
        renderAll: function(text) {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }

            controller.setRenderState('done'); // 设置controller的render状态

            this.clearContent();

            let textNode = document.createElement('p');
            textNode.className = 'text';

            textNode.innerHTML = text;
            this.container.appendChild(textNode);
        },
        clearContent: function() {
            this.container.innerHTML = '';
        }
    }

    let choiceView = {
        init: function() {
            this.list = document.getElementById('choiceList');
        },
        render: function(arr) {
            let fragment = document.createDocumentFragment();

            arr.forEach((choice, index) => {
                let li = document.createElement('li');

                let choiceNode = document.createElement('a');

                choiceNode.tabIndex = index + 1;
                choiceNode.className = 'choice';

                let choiceText = document.createTextNode(choice.text);

                choiceNode.appendChild(choiceText);
                li.appendChild(choiceNode);
                fragment.appendChild(li);

                choiceNode.addEventListener('click', (e) => {
                    e.stopPropagation();

                    controller.renderHandler.text.call(controller, choice.answer);
                });
            });

            this.list.appendChild(fragment);
        },
        clearContent: function() {
            this.list.innerHTML = '';
        },
        show: function() {
            this.list.classList.remove('hide');
        },
        hide: function() {
            this.list.classList.add('hide');
        }
    }

    let controller = {
        init: function() {
            const RENDER_DONE = 'done';
            const RENDERING = 'rendering';

            const SPACE_KEYCODE = 32;
            const ENTER_KEYCODE = 13;

            this.isChoice = false;
            this.renderState = RENDERING;

            let _self = this;
            // 绑定点击和按键时的监听
            let nextData = function(e) {
                if (e.type === 'click' || e.keyCode === SPACE_KEYCODE) {
                    // 如果文本还在渲染中
                    if (_self.renderState === RENDERING) {
                        textView.renderAll(_self.currText);
                        return;
                    }

                    if (data.length === 0) {
                        document.body.removeEventListener('keydown', nextData);
                        document.body.removeEventListener('click', nextData);
                        return;
                    }

                    if (!_self.isChoice) {
                        _self.processData();
                    }
                }
            }
            document.body.addEventListener('keydown', nextData);
            document.body.addEventListener('click', nextData);

            let makeChoice = function(e) {
                if (_self.isChoice && e.keyCode === ENTER_KEYCODE) {
                    let el = document.activeElement;
                    if (el.className = 'choice') {
                        el.click();
                    }
                }
            }
            document.body.addEventListener('keydown', makeChoice);
        },
        processData: function() {
            let item = data.shift();
            this.renderHandler[item.type].call(this, item);
        },
        renderHandler: {
            // 若是直接调用，this指向的不是controller，调用时需手动指明this
            text: function(item) {
                this.isChoice = false;

                let text = item.text || item;

                choiceView.hide();
                choiceView.clearContent();
                textView.clearContent();
                textView.render(text);
            },
            choice: function(item) {
                this.isChoice = true;

                let textRenderDone = function() {
                    choiceView.show.call(choiceView);
                }

                choiceView.clearContent();
                choiceView.render(item.choiceList);
                textView.clearContent();
                textView.render(item.text, textRenderDone);
            }
        },
        setRenderState: function(state) {
            this.renderState = state;

            // 如果文本渲染完成且这是一个选项，则展示所有选项
            if (this.renderState === 'done' && this.isChoice) {
                choiceView.show();
            }
        },
        setCurrText: function(text) {
            this.currText = text;
        }
    }

    textView.init();
    choiceView.init();
    controller.init();

    controller.processData();
})();