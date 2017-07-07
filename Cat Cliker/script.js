'use strict';

let Clicker = function(imgURL, title) {
    this.imgURL = imgURL;
    this.title = title;
    this.count = 0;

}

// 生成一个clicker元素
Clicker.prototype.init = function() {
    let container = document.createElement('div');

    let img = new Image();
    img.className = 'img';
    img.src = this.imgURL;

    let title = document.createElement('h2');
    title.className = 'title';
    title.textContent = this.title;

    let count = document.createElement('span');
    count.className = 'count';
    count.textContent = this.count;

    container.appendChild(title);
    container.appendChild(img);
    container.appendChild(count);

    this._initCount(img, count);

    return container;
}

Clicker.prototype._initCount = function(clickEl, count) {
    let self = this;
    clickEl.addEventListener('click', function() {
        self.count++;

        count.textContent = self.count;
    })
}

let clickerData = [{
    imgURL: './img/cat1.jpg',
    title: '黑老大'
}, {
    imgURL: './img/cat2.jpg',
    title: '蓝珠子'
}]

let clickerCache = {};

let initList = function() {
    let fragment = document.createDocumentFragment();
    let clickerList = document.getElementById('clickerList');
    let clickerContainer = document.getElementById('clickerContainer');

    clickerData.forEach((data, index) => {
        let { title, imgURL} = data;

        let clickerItem = document.createElement('li');
        clickerItem.className = 'clicker-item';

        let btn = document.createElement('a');
        btn.className = 'btn';
        btn.textContent = title;

        btn.addEventListener('click', () => {
            let clicker;
            if (clickerCache[index]) {
                clicker = clickerCache[index];
            } else {
                clicker = new Clicker(imgURL, title);
                clickerCache[index] = clicker;
            }
            let clickerEL = clicker.init();

            clickerContainer.innerHTML = '';
            clickerContainer.appendChild(clickerEL);
        });

        clickerItem.appendChild(btn);
        fragment.appendChild(clickerItem);
    });

    clickerList.appendChild(fragment);
};

initList();
