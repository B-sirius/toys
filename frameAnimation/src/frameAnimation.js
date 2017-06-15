'use strict';

let loadImg = require('./imgLoader');
let timeline = require('./timeline');

const STATE_INITIAL = 0,
      STATE_START = 1,
      STATE_STOP = 2,
      TASK_SYNC = 0;
      TASK_ASYNC = 1;

/**
 * 简单的函数封装，执行callback
 * @param callback 执行的函数
 */
let next = function(callback) {
    callback && callback();
}

/**
 * 帧动画类
 * @constructor
 */
let Animation = function() {
    this.taskQuque = [];
    this.index = 0;
    this.timeline = new Timeline();
    this.state = STATE_INITIAL;
}

/**
 *  添加一个同步任务，去预加载图片
 *  @param imgList 图片数组
 */
Animation.prototype.loadImage = function(imgList) {
    let taskFn = function(next) {
        loadImage(imgList.slice(), next); // 此处slice会得到imgList的深拷贝，这样就不会修改原数组
    }
    let typr = TASK_SYNC;

    return this._add(taskFn, type);
}

/**
 * 添加一个异步定时任务，通过定时改变图片的背景位置，实现帧动画
 * @param ele dom对象
 * @param positions 背景位置数组
 * @param imgUrl 图片地址
 */
Animation.prototype.changePosition = function(ele, positions, imgUrl) {
    let len = positions.length;
    let taskFn;
    let type;

    if (len) {
        let _self = this;
        taskFn = function(next, time) {
            if (imgUrl) {
                ele.style.backgroundImage = `url(${imgUrl})`;
            }
            let index = Math.min(time / _self.interval | 0, len - 1); // xxx \ 0 是比Math.floor更快的方法
            let position = positions[index].split(' ');
            // 改变dom对象的背景图片位置
            ele.style.backgroundPosition = position[0] + 'px' + position[1] + 'px';
            if (index === len - 1) {
                next();
            }
        };
        type = TASK_ASYNC;
    } else {
        taskFn = next;
        type = TASK_SYNC;
    }

    return this._add(taskFn, type);
}

/**
 * 添加一个异步定时任务，通过定时改变图片的src属性，实现帧动画
 * @param ele
 * @param imgList
 */
Animation.prototype.changeSrc = function(ele, imgList) {
    let len = imgList.length;
    let taskFn;
    let type;

    if (len) {
        let _self = this;
        taskFn = function(next, time) {
            // 获得当前图片索引
            let index = Math.min(time / _self.interval | 0, len - 1);
            // 改变图片地址
            ele.src = imgList[index];
            if (index === len - 1) {
                next();
            }
        }
        type = TASK_ASYNC;
    } else {
        taskFn = next;
        type = TASK_SYNC;
    }

    return this._add(taskFn, type);
}

/**
 * 高级用法，定义一个异步定时执行的任务
 * 该任务自定义动画每帧执行的任务函数
 * @parma taskFn 自定义每帧执行的任务函数
 */
Animation.prototype.enterFrame = function(taskFn) {
    return this._add(taskFn, TASK_ASYNC);
}

/**
 * 添加一个同步任务，可以在上一个任务完成后执行回调函数
 */
Animation.prototype.then = function(taskFn) {
    let taskFn = function(next) {
        callback();
        next();
    };
    let type = TASK_SYNC;
    return this._add(taskFn, type);
}

/**
 * 开始执行任务，异步定义任务执行的间隔k
 * @param interval
 */
Animation.prototype.start = function(interval) {
    if (this.state === STATE_START) {
        return this;
    }
    if (!this.taskQuque.length) {
        return this;
    }
    this.state = STATE_START;
    this.interval = interval;
    this._runTask();
    return this;
}

/**
 * 添加一个同步任务，该任务就是回退到上一个任务中，
 * 实现重复上一个任务的效果，可定义重复的次数。
 * @param times 重复次数，不传入则无限循环
 */
Animation.prototype.repeat = function(times) {
    let _self = this;
    let taskFn  = function() {
        if (typeof times === 'undefined') {
            // 无限回退到上一个任务
            _self.index--;
            _self._runTask();
            return;
        }
        if (times) {
            times--;
            // 回退
            _self.index--;
            _self._runTask();
        } else {
            // 达到重复次数，跳转到下一个任务
            let task = _self.taskQueue[_self.index];
            _self._next(task);
        }
    }
    let type = TASK_SYNC;

    return this._add(taskFn, type);
}

/**
 * 添加一个同步任务，相当与repeat()更有好的接口，无线循环上一次任务
 */
Animation.prototype.repeatForever = function() {
    return this.repeat();
}

/**
 * 设置当前任务执行结束后到下一个任务的等待时间
 * @param time 等待时长
 */
Animation.prototype.wait = function(time) {
    if (this.taskQueue && this.taskQueue.length > 0) {
        this.taskQueue[this.taskQueue.length - 1].wait = time;
    }
    return this;
}

/**
 * 暂停当前异步定时任务
 */
Animation.prototype.pause = function() {
    if (this.state === STATE_START) {
        this.state = STATE_STOP;
        this.timeline.stop();
        return this;
    }
    return this;
}

/**
 * 重新执行上一次暂停的异步定时任务
 */
Animation.prototype.restart = function() {
    if (this.state === STATE_STOP) {
        this.state = STATE_START;
        this.timeline.restart();
        return this;
    }
    return this;
}

/**
 * 释放资源
 */
Animation.prototype.dispose = function() {
    if (this.state !== STATE_INITIAL) {
        this.state = STATE_INITIAL;
        this.taskQuque = null;
        this.timeline.stop();
        this.timeline = null;
        return this;
    }
}

/**
 * 添加一个任务到任务队列中
 * @param taskFn 任务方法
 * @param type   任务类型
 */
Animation.prototype._add = function(taskFn, type) {
    this.taskQuque.push({
        taskFn,
        type
    });

    return this;
}

/**
 * 执行任务
 */
Animation.prototype._runTask = function() {
    if (!this.taskQuque || this.state !== STATE_START) {
        return;
    }
    // 任务执行完毕
    if (this.index === this.taskQuque.length) {
        this.dispose();
        return;
    }
    // 获得任务链上单独任务
    let task = this.taskQuque[this.index];
    if (task.type === TASK_SYNC) {
        this._syncTask(task);
    } else {
        this._asyncTask(task);
    }
}

/**
 * 同步任务
 * @param task 执行的任务对象
 */
Animation.prototype._syncTask = function(task) {
    let _self = this;
    let next = function() {
        // 切换到下一个任务
        _self._next(task);
    }

    let taskFn = task.taskFn;
    taskFn(next);
}

/**
 * 异步任务
 * @param task 执行的任务对象
 */
Animation.prototype._asyncTask = function(task) {
    let _self = this;
    // 定义每一帧执行的回调函数
    let enterFrame = function(time) {
        let taskFn  = task.taskFn;

        let next = function() {
            _self.timeline.stop(); // 停止当前任务
            _self._next(task); // 执行下一个任务
        }

        taskFn(next, time);
    }

    this.timeline.onenterframe = enterFrame;
    this.timeline.start.start(this.interval);
}

/**
 * 切换到下一个任务，如果当前任务需要等待，则延时执行
 * @param task 当前任务
 */
Animation.prototype._next = function(task) {
    this.index++;

    let _self = this;
    task.wait ? setTimeout(function() {
        _self._runTask();
    }, task.wait) : this._runTask();
}

module.exports = function() {
    return new Animation();
}