'use strict';

let getById = (id) => {
    return document.getElementById(id);
}

let eyeL = Snap.select('#eyeL');

let anima = Snap.animate(7, 0, function(val) {
    eyeL.attr({
        ry: val
    });
}, 500);

