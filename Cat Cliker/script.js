'use strict';

let catPicture = document.getElementById('picture');
let countEl = document.getElementById('count');

let renderCount = (function() {
    let count = 0;

    catPicture.addEventListener('click', () => {
        count++;
        renderCount();
    });

    return function() {
        countEl.textContent = count;
    }
})();