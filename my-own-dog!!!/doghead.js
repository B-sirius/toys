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
const dogGroup = Snap.select('#dogGroup');
const bone = Snap.select('#bone');
const eyeGroup = Snap.select('#eyeGroup');
const eyeL = Snap.select('#eyeL');
const eyeR = Snap.select('#eyeR');
const eyeSpinL = Snap.select('#eyeSpinL');
const eyeSpinR = Snap.select('#eyeSpinR');
const earL = Snap.select('#earL');
const earR = Snap.select('#earR');
const browGroup = Snap.select('#browGroup');
const browL = Snap.select('#browL');
const browR = Snap.select('#browR');
const snout = Snap.select('#snout');
const nose = Snap.select('#nose');
const noseShine = Snap.select('#noseShine');

// 范围
const eyeMaxY = 1;
const browMaxY = 2;
const browMaxRot = 0;
const snoutMinY = 2;
const snoutMaxY = 12;
const noseMaxY = 12;
const stageWidth = dogSVG.attr('width');
const stageHeight = dogSVG.attr('height');

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
TweenMax.set([nose.node, bone.node, eyeL.node, eyeR.node], {
    transformOrigin: '50% 50%',
});
TweenMax.set(browL.node, {
    transformOrigin: '0% 50%'
});
TweenMax.set(browR.node, {
    transformOrigin: '100% 150%'
});
TweenMax.set([eyeSpinL.node, eyeSpinR.node], {
    transformOrigin: '65% 50%'
});

// 眨眼
let blink = function () {
    TweenMax.to([eyeL.node, eyeR.node], 0.1, {
        attr: {
            ry: 0
        },
        repeat: 1,
        yoyo: true,
        onComplete: blink,
        delay: Math.random() * 10
    });
};

// 嗅嗅
let sniff = function () {
    TweenMax.to(nose.node, 0.1, {
        scaleX: 1.1,
        repeat: 1,
        yoyo: true,
        onComplete: sniff,
        delay: Math.random()
    });
}

// 鼻头高光，其实就是遮住一部分路径
let noseShineTL = new TimelineMax({ paused: true });

noseShineTL.fromTo(noseShine.node, 1, {
    drawSVG: '0% 20%'
}, {
        drawSVG: '0% 50%',
        ease: Linear.easeNone
    }).to(noseShine.node, 1, {
        drawSVG: '40% 60%',
        ease: Linear.easeNone
    }).to(noseShine.node, 1, {
        drawSVG: '80% 100%',
        ease: Linear.easeNone
    });

// 鼠标移动动态
dogSVG.mousemove(function move(e) {
    // 鼠标相对狗头中心位置
    let rePos = {
        x: ((e.offsetX - stageWidth / 2)),
        y: ((e.offsetY - stageHeight / 2)),
    };
    TweenMax.to(eyeGroup.node, 1, {
        x: rePos.x / 20,
        y: ((rePos.y / 12) > eyeMaxY) ? eyeMaxY : rePos.y / 12
    });

    TweenMax.to(browL.node, 1, {
        rotation: ((rePos.y / 25) > browMaxRot) ? browMaxRot : rePos.y / 25
    });
    TweenMax.to(browR.node, 1, {
        rotation: -((rePos.y / 15) > browMaxRot) ? -browMaxRot : -rePos.y / 15
    });
    TweenMax.to(browGroup.node, 1, {
        x: rePos.x / 40,
        y: ((rePos.y / 25) > browMaxY) ? browMaxY : rePos.y / 25
    });

    TweenMax.to(snout.node, 1, {
        x: rePos.x / 30,
        y: ((rePos.y / 60) < snoutMinY) ? snoutMinY : rePos.y / 60
    });
    TweenMax.to(nose.node, 1, {
        x: rePos.x / 8,
        y: ((rePos.y / 10) > noseMaxY) ? noseMaxY : rePos.y / 10
    });
    TweenMax.to([earL.node, earR.node], 1, {
        x: -(rePos.x / 50),
        y: -(rePos.y / 50)
    });
    TweenMax.to(dogGroup.node, 1, {
        x: (rePos.x / 23),
        y: (rePos.y / 23)
    });
    TweenMax.to(bone.node, 1, {
        x: e.offsetX - (bone.getBBox().width / 2),
        y: e.offsetY - (bone.getBBox().height / 2),
        ease: Elastic.easeOut.config(0.7, 0.8)
    })

    TweenMax.set(noseShineTL, {
        time: noseShineTL.duration() - (e.offsetX / stageWidth * noseShineTL.duration())
    });
});

dogSVG.click(function (e) {
    TweenMax.to([bone.node, eyeSpinL.node, eyeSpinR.node], 1, {
        rotation: '+=720',
        // 这里是将内部eye反向eyeSpin旋转，使眼睛只相对面部旋转而不改变其角度，这样在旋转时眨眼才不会鬼畜
        onUpdate: function() {
            TweenMax.set([eyeL.node, eyeR.node], {
                rotation: -eyeSpinL.node._gsTransform.rotation
            });
        }
    })
})

blink();
sniff();