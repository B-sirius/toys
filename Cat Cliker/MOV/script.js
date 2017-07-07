'use strict';

let model = {
    clickerData: [{
        count: 0,
        imgURL: '../img/cat1.jpg',
        title: '黑老大'
    }, {
        count: 0,
        imgURL: '../img/cat2.jpg',
        title: '蓝珠子'
    }],
    currIndex: 0,
};

let octopus = {
    setCurrClicker: function(index) {
        model.currIndex = index;

        clickerView.renderClicker();
    },
    getCurrClicker: function() {
        let index = model.currIndex;

        return model.clickerData[index];
    },
    addCount: function() {
        let index = model.currIndex;
        model.clickerData[index].count++;

        clickerView.updateCount();
    },
    getCount: function() {
        let index = model.currIndex;

        return model.clickerData[index].count;
    },
    getClickers: function() {
        return model.clickerData;
    }
};

let listView = {
    init: function() {
        let clickerData = octopus.getClickers();

        let fragment = document.createDocumentFragment();
        let clickerList = document.getElementById('clickerList');
        let clickerContainer = document.getElementById('clickerContainer');

        clickerData.forEach((data, index) => {
            let title = data.title;

            let clickerItem = document.createElement('li');
            clickerItem.className = 'clicker-item';

            let btn = document.createElement('a');
            btn.className = 'btn';
            btn.textContent = title;

            clickerItem.appendChild(btn);
            fragment.appendChild(clickerItem);

            btn.addEventListener('click', () => {
                octopus.setCurrClicker(index);
            });
        });

        clickerList.appendChild(fragment);
    }
}

let clickerView = {
    init: function() {
        this.title = document.getElementById('clickerTitle');
        this.clickerImg = document.getElementById('clickerImg');
        this.count = document.getElementById('clickerCount');

        this.clickerImg.addEventListener('click', function() {
            octopus.addCount();
        });

        this.renderClicker();
    },
    renderClicker: function() {
        let data = octopus.getCurrClicker();

        this.title.textContent = data.title;
        this.clickerImg.src = data.imgURL;
        this.count.textContent = data.count;
    },
    updateCount: function() {
        let count = octopus.getCount();

        this.count.textContent = count;
    }
}

listView.init();
clickerView.init();