'use strict';
//===================== get some help ======================
// 基于Promise的异步任务
function run(gen, ...args) {
    // 初始化generator
    let iterator = gen.apply(this, args);

    return Promise.resolve().then(
        function handleNext(value) {
            let next = iterator.next(value);

            return (function handleResult(next) {
                // generator运行完成?
                if (next.done) {
                    return next.value;
                }
                // 否则继续执行
                else {
                    return Promise.resolve(next.value).then(
                        // 成功便继续异步循环
                        handleNext,
                        // 如果value是拒绝的promise，将错误传播回generator处理
                        function handleErr(err) {
                            return Promise.resolve(
                                iterator.throw(err)
                            ).then(handleResult);
                        }
                    )
                }
            })(next);
        }
    )
}

//===================== main part =========================
// Snap element
const dogSVG = Snap.select('#dogSVG');
const bone = Snap.select('#bone');
const eyeGroup = Snap.select('#eyeGroup');
const eyeL = Snap.select('#eyeL');
const eyeR = Snap.select('#eyeR');
const eyeSpinL = Snap.select('#eyeSpinL');
const eyeSpinR = Snap.select('#eyeSpinR');
const browGroup = Snap.select('#browGroup');
const browL = Snap.select('#browL');
const browR = Snap.select('#browR');
const snout = Snap.select('#snout');
const nose = Snap.select('#nose');

// 范围
const eyeMaxY = 13;
const browMaxY = 2;
const browMaxRot = 0;
const snoutMinY = 2;
const snoutMaxY = 20;
const noseMaxY = 12;

// 唯一标识符
const noseTransformAttr = Symbol('nose');

// 禁用svg内所有图像的鼠标事件
let disablePointEvents = (function () {
    let disableTypeList = ['path', 'rect', 'circle', 'line', 'ellipse', 'g'];

    let disable = function (node) {
        let children = node.children();
        if (children.length) {
            for (let item of children) {
                for (let type of disableTypeList) {
                    if (item.type === type) {
                        item.attr({
                            'pointer-events': 'none'
                        });
                        disable(item);
                    }
                }
            }
        }
    }

    disable(dogSVG);
})();

// 初始化定位点
Snap.set(nose, bone, eyeL, eyeR).attr({
    'transform-origin': '50% 50%',
});
browL.attr({
    'transform-origin': '0% 50%'
});
browR.attr({
    'transform-origin': '100% 150%'
});

// 眨眼
let blink = (function () {
    let close = function (eye) {
        let promise = new Promise((resolve, reject) => {
            Snap.animate(7, 0, function (val) {
                eye.attr({
                    ry: val
                });
            }, 50, undefined, resolve);
        });

        return promise;
    }

    let open = function (eye) {
        let promise = new Promise((resolve, reject) => {
            Snap.animate(0, 7, function (val) {
                eye.attr({
                    ry: val
                });
            }, 50, undefined, resolve);
        });

        return promise;
    }

    function* blinkEye(eye) {
        yield close(eye);
        yield open(eye);
    };

    setInterval(function () {
        run(blinkEye, eyeL);
        run(blinkEye, eyeR);
    }, 5000);
})();

// 嗅嗅
let sniff = (function () {
    nose[noseTransformAttr] = {
        'scale': '',
        'translate3d': '',
    };

    function* main() {
        yield (function () {
            nose[noseTransformAttr]['scale'] = 'scale(1.1, 1)';

            let promise = new Promise((resolve, reject) => {
                nose.animate({
                    transform: `${nose[noseTransformAttr].scale} ${nose[noseTransformAttr].translate3d}`,
                }, 100, undefined, resolve);
            });

            return promise;
        })();

        yield (function () {
            nose[noseTransformAttr]['scale'] = 'scale(1, 1)';

            let promise = new Promise((resolve, reject) => {
                nose.animate({
                    transform: `${nose[noseTransformAttr].scale} ${nose[noseTransformAttr].translate3d}`,
                }, 100, undefined, resolve);
            });

            return promise;
        })();
    }

    setInterval(function () {
        run(main);
    }, 700 * Math.random() + 1000);
})();

// 鼠标移动动态
dogSVG.mousemove(function move(e) {
    // 鼠标相对狗头中心位置
    let rePos = {
        x: ((e.offsetX - dogSVG.attr('width') / 2)),
        y: ((e.offsetY - dogSVG.attr('height') / 2)),
    };

    // 眼睛组
    eyeGroup.animate({
        transform: `translate3d(${rePos.x / 20}, ${Math.abs(rePos.y / 12) > eyeMaxY ?
            Math.sign(rePos.y / 12) * eyeMaxY :
            (rePos.y / 12)})`,
    }, 1000, mina.easein);

    // 左眉毛
    browL.animate({
        transform: `rotate(${-(rePos.y / 12) > browMaxRot ?
            rePos.y / 24 :
            browMaxRot
            })`
    }, 1000, mina.easein);

    // 右眉毛
    browR.animate({
        transform: `rotate(${-(rePos.y / 12) > browMaxRot ?
            -rePos.y / 17 :
            browMaxRot
            })`
    }, 1000, mina.easein);

    // 眉毛组
    browGroup.animate({
        transform: `translate3d(${rePos.x / 40}, ${Math.abs(rePos.y / 25) > browMaxY ?
            Math.sign(rePos.y / 40) * browMaxY :
            (rePos.y / 25)})`
    }, 1000, mina.easein);

    // 大嘴盘子
    snout.animate({
        transform: `translate3d(${rePos.x / 30}, ${Math.abs(rePos.y / 40) > snoutMaxY ?
            Math.sign(rePos.y / 40) * snoutMaxY :
            (rePos.y / 40)})`
    }, 1000, mina.easein);

    // 鼻子
    let noseX = rePos.x / 8,
        noseY = Math.abs(rePos.y / 10) > noseMaxY ?
            Math.sign(rePos.y / 40) * noseMaxY :
            (rePos.y / 40);
    nose[noseTransformAttr].translate3d = `translate3d(${noseX}, ${noseY})`;
    nose.animate({
        transform: `${nose[noseTransformAttr].scale} ${nose[noseTransformAttr].translate3d}`,
    }, 1000, mina.easein);
});