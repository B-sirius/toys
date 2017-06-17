'use strict';

Window.AudioContext = Window.AudioContext || Window.webkitAudioContext;
let audioCtx = new AudioContext();

(() => {
    let keyFrequency = [246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
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

        let oscillator = audioCtx.createOscillator();
        let gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.value = this.frequency;
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
        oscillator.start(audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
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
