'use strict';

window.requestAnimationFrame = window.requestAnimationFrame || function (fn) {
    setTimeout(fn, 17);
};

// 渲染背景
var renderBackground = function () {
    var canvas = document.getElementById('spaceCanvas');

    var ctx = canvas.getContext('2d');

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    var stars = {};

    var LittleStar = function LittleStar() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 1 + Math.random() * 2;
        this.speedX = 0.1 * Math.random();
        this.shineSpeed = 0.01 * Math.random();
        this.maxBrightness = 0.3 + Math.random() * 0.5;
        this.brightness = 0;
    };

    LittleStar.prototype.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, ' + this.brightness + ')';
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    };

    LittleStar.prototype.shine = function () {
        var t = this.brightness + this.shineSpeed;
        if (t > 1 || t < 0) {
            this.shineSpeed = -this.shineSpeed;
        }

        this.brightness += this.shineSpeed;
    };

    var initSpaceCanvas = function () {
        for (var i = 0; i < 100; i++) {
            stars[i] = new LittleStar();
        }

        var drawStars = function drawStars() {
            for (var _i in stars) {
                // 亮度变化
                stars[_i].shine();

                // 位置变化
                stars[_i].x += stars[_i].speedX;
                if (stars[_i].x > canvas.width) {
                    stars[_i].x = 0 - 2 * stars[_i].radius;
                }

                stars[_i].draw();
            }
        };

        var render = function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawStars();

            requestAnimationFrame(render);
        };

        render();
    }();
}();

// 初始化对话系统
var initQA = function () {
    var data = [{
        type: 'choice',
        text: '你对于这头巨兽的出现感到十分震惊，你决定',
        choiceList: [{
            text: 'A. ‘来一局昆特牌吧！’',
            answer: '尽管你已经有意放水，但TA还是输的彻彻底底'
        }, {
            text: 'B. 问问TA喜欢什么',
            answer: '嗯，TA不喜欢你'
        }, {
            text: 'C. 使用百万吨重拳',
            answer: '效果拔群，无敌的 annoying dog 倒下了'
        }, {
            text: 'D. 无视之',
            answer: '13. DEAD END'
        }]
    }, {
        type: 'text',
        text: '按照系统TA应该说些什么，但是TA现在好像无FA可说'
    }];

    var textView = {
        init: function init() {
            this.container = document.getElementById('textContainer');
            this.interval = null;
        },
        /**
         * 一个个字母地渲染
         * @param  string   text 需要渲染的字符串
         */
        render: function render(text) {
            var _this = this;

            controller.setRenderState('rendering'); // 设置controller的render状态
            controller.setCurrText(text); // 设置controller当前正在渲染的文本

            var textNode = document.createElement('p');
            textNode.className = 'text';
            this.container.appendChild(textNode);

            text = text.split('');
            this.interval = setInterval(function () {
                if (text.length === 0) {
                    clearInterval(_this.interval);
                    _this.interval = null;

                    controller.setRenderState('done'); // 设置controller的render状态

                    return;
                }
                var letter = text.shift();
                textNode.innerHTML += letter;
            }, 50);
        },
        // 直接呈现整句话
        renderAll: function renderAll(text) {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }

            controller.setRenderState('done'); // 设置controller的render状态

            this.clearContent();

            var textNode = document.createElement('p');
            textNode.className = 'text';

            textNode.innerHTML = text;
            this.container.appendChild(textNode);
        },
        clearContent: function clearContent() {
            this.container.innerHTML = '';
        }
    };

    var choiceView = {
        init: function init() {
            this.list = document.getElementById('choiceList');
        },
        render: function render(arr) {
            var fragment = document.createDocumentFragment();

            arr.forEach(function (choice, index) {
                var li = document.createElement('li');

                var choiceNode = document.createElement('a');

                choiceNode.tabIndex = index + 1;
                choiceNode.className = 'choice';

                var choiceText = document.createTextNode(choice.text);

                choiceNode.appendChild(choiceText);
                li.appendChild(choiceNode);
                fragment.appendChild(li);

                choiceNode.addEventListener('click', function (e) {
                    e.stopPropagation();

                    controller.renderHandler.text.call(controller, choice.answer);
                });
            });

            this.list.appendChild(fragment);
        },
        clearContent: function clearContent() {
            this.list.innerHTML = '';
        },
        show: function show() {
            this.list.classList.remove('hide');
        },
        hide: function hide() {
            this.list.classList.add('hide');
        }
    };

    var controller = {
        init: function init() {
            var RENDER_DONE = 'done';
            var RENDERING = 'rendering';

            var SPACE_KEYCODE = 32;
            var ENTER_KEYCODE = 13;

            this.isChoice = false;
            this.renderState = RENDERING;

            var _self = this;
            // 绑定点击和按键时的监听
            var nextData = function nextData(e) {
                if (e.type === 'click' || e.keyCode === SPACE_KEYCODE || e.keyCode === ENTER_KEYCODE) {
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
            };
            document.body.addEventListener('keydown', nextData);
            document.body.addEventListener('click', nextData);

            var makeChoice = function makeChoice(e) {
                if (_self.isChoice && e.keyCode === ENTER_KEYCODE) {
                    var el = document.activeElement;
                    if (el.className = 'choice') {
                        el.click();
                    }
                }
            };
            document.body.addEventListener('keydown', makeChoice);
        },
        processData: function processData() {
            var item = data.shift();
            this.renderHandler[item.type].call(this, item);
        },
        renderHandler: {
            // 若是直接调用，this指向的不是controller，调用时需手动指明this
            text: function text(item) {
                this.isChoice = false;

                var text = item.text || item;

                choiceView.hide();
                choiceView.clearContent();
                textView.clearContent();
                textView.render(text);
            },
            choice: function choice(item) {
                this.isChoice = true;

                var textRenderDone = function textRenderDone() {
                    choiceView.show.call(choiceView);
                };

                choiceView.clearContent();
                choiceView.render(item.choiceList);
                textView.clearContent();
                textView.render(item.text, textRenderDone);
            }
        },
        setRenderState: function setRenderState(state) {
            this.renderState = state;

            // 如果文本渲染完成且这是一个选项，则展示所有选项
            if (this.renderState === 'done' && this.isChoice) {
                choiceView.show();
            }
        },
        setCurrText: function setCurrText(text) {
            this.currText = text;
        }
    };

    textView.init();
    choiceView.init();
    controller.init();

    controller.processData();
}();