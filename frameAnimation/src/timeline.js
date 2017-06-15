'use strict';
const DEFAULT_INTERVAL = 1000 / 60;

const STATE_INITIAL = 0, // 初始化状态
    STATE_START = 1, // 开始状态
    STATE_STOP = 2; // 停止状态
/**
 * 时间轴类
 * @constructor
 */

let Timeline = function() {
    this.animationHandler = 0;
    this.state = STATE_INITIAL;
};

/**
 * 时间轴上每一次回调执行的函数
 * @param time 从动画开始到当前执行的时间
 */
Timeline.prototype.onenterframe = function(time) {
};

/**
 * 动画开始
 * @param interval 每一次回调的间隔时间
 */
Timeline.prototype.start = function(interval) {
    if (this.state === STATE_START) {
        return;
    }
    this.state = STATE_START;

    this.interval = interval || DEFAULT_INTERVAL;
    startTimeline(this. + new Date());
};

/**
 * 动画停止
 */
Timeline.prototype.stop = function() {
    if (this.state !== STATE_START) {
        return;
    }
    this.state = STATE_STOP;

    // 如果动画开始，则记录动画开始到现在所经历的时间
    if (this.startTime) {
        this.dur = +new Date() - this.startTime;
    }
    cancelAnimationFrame(this.animationHandler);
}

/**
 * 重新开始动画
 */
Timeline.prototype.restart = function() {
    if (this.state !== STATE_START) {
        return;
    }
    if (!this.dur || !this.interval) {
        return;
    }
    this.state = STATE_START;

    // 无缝衔接动画
    startTimeline(this, +new Date() - this.dur);
}

/**
 * 时间轴动画启动函数
 * @param timeline  时间轴的实例
 * @param startTime 动画开始时间戳
 */
let startTimeline = function(timeline, startTime) {
    let nextTick = function() {
        let now = +new Date();

        timeline.animationHandler =requestAnimationFrame(nextTick);

        // 如果当前时间与上一次回调的时间戳大于设置的时间间隔，
        // 表示这一次可以执行回调函数
        if (now - lastTick >= timeline.interval) {
            timeline.onenterframe(now - startTime);
            lastTick = now;
        }
    }

    timeline.startTime = startTime;
    nextTick.interval = timeline.interval;

    let lastTick = +new Date();

    nextTick();
}

module.exports = Timeline;