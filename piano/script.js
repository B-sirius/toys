'use strict';

Window.AudioContext = Window.AudioContext || Window.webkitAudioContext;
let audioCtx = new AudioContext();

(() => {
    let keyFrequency = [241.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
    let keyCodeList = [186, 76, 75, 74, 70, 68, 83, 65];

    let Key = function(el, keyCode, frequency) {
        this.el = el;
        this.keyCode = keyCode;
        this.frequency = frequency;
    }

    Key.prototype.addEvent = function() {
        let self = this;
        this.el.addEventListener('mousedown', () => {
            self.makeSound();
        });
    }

    Key.prototype.makeSound = function() {
        // 创建一个声音（周期性波形）
        let oscillator = audioCtx.createOscillator();
        // 创建一个音量大小
        let gainNode = audioCtx.createGain();
        // 关联声音和音量
        oscillator.connect(gainNode);
        // 关联声音与音频输出设备
        gainNode.connect(audioCtx.destination);
        // 声音波形，有正弦sine, 方波square, 三角波triangle, 锯齿波sawtooth
        oscillator.type = 'sine'; // 正弦波
        // 波形的频率，数值越大越清脆
        oscillator.frequency.value = this.frequency;
        // 设置当下音量为0
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        // 在0.01秒内将声音线性从0变到1
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
        // 播放这个声音
        oscillator.start(audioCtx.currentTime);
        // 1秒内将声音从1指数曲线变为0.001
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        // 一秒后，声音关闭
        oscillator.stop(audioCtx.currentTime + 1);
    }

    // 实例化
    let keys = document.getElementsByClassName('key');

    let keyCodeMap = {};
    for (let i = keys.length - 1; i >= 0; i--) {
        let key = new Key(keys[i], keyCodeList[i], keyFrequency[i]);
        keyCodeMap[keyCodeList[i]] = key;
        key.addEvent();
    }

    document.addEventListener('keydown', (e) => {
        if (keyCodeMap[e.keyCode]) {
            keyCodeMap[e.keyCode].makeSound();
        }
    });
})();
