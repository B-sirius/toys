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
    showControlView: false
};

let octopus = {
    setCurrClicker: function(index) {
        model.currIndex = index;

        clickerView.renderClicker();
        controlView.render();
    },
    getCurrClicker: function() {
        let index = model.currIndex;

        return model.clickerData[index];
    },
    addCount: function() {
        let index = model.currIndex;
        model.clickerData[index].count++;

        clickerView.updateCount();
        controlView.render();
    },
    getCount: function() {
        let index = model.currIndex;

        return model.clickerData[index].count;
    },
    getIndex: function() {
        return mdoel.currIndex;
    },
    getClickers: function() {
        return model.clickerData;
    },
    setData: function(data) {
        let oldData = this.getCurrClicker();
        
        for (let prop in oldData) {
            oldData[prop] = data[prop];
        }

        let index = model.currIndex;
        let title = data.title;
        listView.render(index, title);
        clickerView.renderClicker();
    },
    resetData: function() {
        controlView.render();
    },
    toggleControl: function() {
        model.showControlView = !model.showControlView;

        if (model.showControlView) {
            controlView.show();
        } else {
            controlView.hide();
        }
    }
};

let listView = {
    init: function() {
        let clickerData = octopus.getClickers();

        let fragment = document.createDocumentFragment();
        let clickerList = document.getElementById('clickerList');
        let clickerContainer = document.getElementById('clickerContainer');

        this.btnList = {};

        let self = this;
        clickerData.forEach((data, index) => {
            let title = data.title;

            let clickerItem = document.createElement('li');
            clickerItem.className = 'clicker-item';

            let btn = document.createElement('a');
            btn.className = 'btn';
            btn.textContent = title;
            self.btnList[index] = btn;

            clickerItem.appendChild(btn);
            fragment.appendChild(clickerItem);

            btn.addEventListener('click', () => {
                octopus.setCurrClicker(index);
            });
        });

        clickerList.appendChild(fragment);
    },
    render: function(index, text) {
        this.btnList[index].textContent = text;
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

let controlView = {
    init: function() {
        this.toggleControlBtn = document.getElementById('toggleControlBtn');
        this.showContainer = document.getElementById('showContainer');

        this.titleInput = document.getElementById('titleInput');
        this.urlInput = document.getElementById('urlInput');
        this.countInput = document.getElementById('countInput');

        this.confirmBtn = document.getElementById('confirmBtn');
        this.cancelBtn = document.getElementById('cancelBtn');

        this.render();

        let self = this;
        this.toggleControlBtn.addEventListener('click', octopus.toggleControl);
        this.confirmBtn.addEventListener('click', () => {
            let data = self._getData();
            octopus.setData(data);
        });
        this.cancelBtn.addEventListener('click', octopus.resetData);
    },
    render: function() {
        let data = octopus.getCurrClicker();

        let {count, imgURL, title} = data;

        this.titleInput.value = title;
        this.urlInput.value = imgURL;
        this.countInput.value = count;
    },
    _getData: function() {
        let title = this.titleInput.value;
        let imgURL = this.urlInput.value;
        let count = this.countInput.value;

        return {
            count,
            imgURL,
            title
        };
    },
    show: function() {
        this.showContainer.classList.remove('hide'); 
    },
    hide: function() {
        this.showContainer.classList.add('hide'); 
    }
}

let init = (() => {
    listView.init();
    clickerView.init();
    controlView.init();
})();