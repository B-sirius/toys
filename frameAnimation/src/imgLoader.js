'use strict';
/**
 * 预加载图片函数
 * @param   img      加载图片的数组或对象
 * @param   callback 全部图片加载完毕后调用的回调函数
 * @param   timeout  加载超时的时长
 */
let loadImg = (function() {
    // 加载完成图片的计数器
    let count = 0;
    // 全部图片加载成功的一个标志位
    let success = true;
    // 超时time的id
    let timeId = 0;
    // 是否加载超时的标志位
    let isTimeOut = false;

    let getId = (function() {
        let _id = 0;
        return ++_id;
    })();

    let doLoad = function(item, callback) {
        item.status = 'loading';

        let img = item.img;
        // 定义图片加载成功的回调函数
        img.onload = function() {
            success = success & true;
            item.status = 'loaded';
            done(img, callback);
        }
        // 定义图片加载失败的回调函数
        img.onerror = function() {
            success = false;
            item.status = 'error';
            done(img, callback);
        }

        // 发起了一个请求来加载图片
        img.src = item.src;
    }

    // 每张图片加载完成的回调函数
    let done = function(img, callback) {
        img.onload = img.onerror = null;

        // 兼容ie
        try {
            delete window[item.id];
        } catch (e) {}

        // 每张图片加载完成，计数器减一，当所有图片加载完成且没有超时的情况
        // 清除超时计时器，且执行回调函数
        if (!--count && !isTimeOut) {
            clearTimeout(timeoutId);
            callback(success);
        }
    }

    /**
     *  超时函数
     */
    let onTimeout = function(callback) {
        isTimeOut = false;
        callback(false);
    }

    return function(imgs, callback, timeout) {
        for (let key in imgs) {
            // 过滤prototype上的属性
            if (!imgs.hasOwnProperty(key)) {
                continue;
            }
            // 获得每个图片元素
            // 期望转换为格式object： {src:xxx}
            let item = imgs[key];

            if (typeof item === 'string') {
                item = imgs[key] = {
                    src: item
                };
            }

            // 如果格式不满足期望，则丢弃数据，进行下一个遍历
            if (!item || !item.src) {
                continue;
            }

            // 计数+1
            ++count;
            // 设置图片元素的id
            item.id = '_img_' + key + getId();
            // 设置图片元素的img，他是一个Image对象
            item.img = window[item.id] = new Image();

            doLoad(item, callback);
        }

        // 如果遍历完成后计数为0,则直接调用callback
        if (!count) {
            callback(success);
        } else if (timeout) {
            timeoutId = setTimeout(function() {
                onTimeout(callback);
            }, timeout);
        }
    }
})();

module.exports = loadImg;