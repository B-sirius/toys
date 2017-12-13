'use strict';

import './style.scss';
// import imgSrc from './assets/Avatar.png';

// 幕布
const canvas = document.querySelector('#js-canvas');
canvas.width = "300";
canvas.height = "300";
const context = canvas.getContext('2d');

// 取点的间隙大小
const gap = 11;
// 当前像素信息
let imageData;

// 缓动函数
let Tween = {
    Expo: {
        easeIn: function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
    }
}

// 获得符合条件的像素点的坐标数组
let getPosList = function () {
    let posList = [];
    let x = 0, y = 0, index = 0;
    for (let i = 0, len = imageData.length; i < len; i += (4 * gap)) {
        // Alpha值为255，既是所谓的透明，保存该像素点坐标
        if (imageData[i + 3] === 255) {
            posList.push({ x, y });
        }

        index = Math.floor(i / 4);
        // 该点对应的坐标
        x = index % canvas.width;
        y = Math.floor(index / canvas.width);

        // 换行,y也是以13为间隔，所以i需要略过中间的点
        if (x >= canvas.width - gap) {
            i += gap * 4 * canvas.width;
        }
    }

    return posList;
}

// 绘制点
let drawCircle = function (p, r) {
    context.beginPath();
    context.arc(p.x, p.y, r, 0, 2 * Math.PI);
    context.fillStyle = 'hsl(145, 98%, 52%)';
    context.fill();
}

// 绘制一帧
let drawCanvas = function (posList) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let item of posList) {
        drawCircle(item, 5);
    }
}

// 连续绘制
let render = function (fromList, toList, duration = 60 * 1) {
    let time = 0;
    const length = fromList.length;

    let step = () => {
        let transitionList = [];

        for (let i = 0; i < length; i++) {
            let from = fromList[i];
            let to = toList[i];
            let x = Tween.Expo.easeOut(time, from.x, to.x - from.x, duration);
            let y = Tween.Expo.easeOut(time, from.y, to.y - from.y, duration);

            transitionList.push({ x, y });
        }

        drawCanvas(transitionList);

        time++;
        if (time < duration)
            requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

// 同步两个数组的长度
let equalLengthArr = function (result, target, defaultItem) {
    if (result.length >= target.length) {
        // 长度超出则截断
        return result.slice(0, target.length);
    } else {
        // 不足则用defaultItem补齐
        return [...result, ...new Array(target.length - result.length).fill(defaultItem)];
    }
}

// 初始输入监听
let initInputListener = (function () {
    let lastList = [];
    const input = document.querySelector('#js-input');
    return function () {
        input.addEventListener('change', () => {
            const value = input.value;
            
            // 绘制字
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'white';
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            context.font = 'bold 280px arial';
            context.fillText(value, canvas.width / 2, canvas.height / 2);
            
            // 获取canvas像素信息
            imageData = context.getImageData(0, 0, 300, 300).data;
            
            // 当前的有效点集
            let imagePosList = getPosList();
            
            // 将之前的点集与当前点集作长度上的同步
            let fromList = equalLengthArr(lastList, imagePosList, { x: canvas.width / 2, y: canvas.height / 2 });
            
            // 50帧的过渡
            render(fromList, imagePosList, 50);
            
            lastList = imagePosList;
        });
    }
})();

initInputListener();

// // demo
// let img = new Image();
// img.src = imgSrc;

// let imgOnloadPromise = new Promise((resolve, reject) => {
//     img.onload = () => {
//         resolve();
//     }
// });

// imgOnloadPromise.then(() => {
//     context.drawImage(img, 0, 0, canvas.width, canvas.height);

//     imageData = context.getImageData(0, 0, 300, 300).data;

//     drawCanvas();
// });