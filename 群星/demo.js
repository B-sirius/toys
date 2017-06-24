// requestAnimationFrame的向下兼容处理
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(fn) {
        setTimeout(fn, 17);
    };
}

({
    drawStarBg: function() {
        var d = document.querySelector("#starCanvas");
        var c = d.getContext("2d");
        var e = {},
            h = 0,
            f = { density: 300, rightWall: d.width, alpha: 0, maxAlpha: 1 };
        var a = function() {
            var m = Math.random();
            var n = Math.ceil(1 / (1 - m));
            var k = [];
            for (var l = 0; l < n; l++) { k.push(Math.random()) }
            return Math.min.apply(null, k)
        };

        function g() {
            var k = window.innerWidth;
            d.width = k;
            d.height = d.parentNode.clientHeight;
            f.rightWall = d.width;
            j()
        }
        g();

        function j() {
            c.clearRect(0, 0, d.width, d.height);
            c.fillStyle = "rgba(0,0,0,0)";
            c.fillRect(0, 0, d.width, d.height)
        }

        function i() {
            this.x = Math.floor(Math.random() * d.width);
            this.y = d.height / 2 + (Math.random() > 0.5 ? 1 : "-1") * d.height / 2 * a();
            this.vx = Math.random() * 0.05 + 0.025;
            this.particleSize = 0.5 + (Math.random() + 0.1 / 4);
            h++;
            e[h] = this;
            this.alpha = 0;
            this.maxAlpha = 0.2 + (this.y / d.height) * Math.random() * 0.8;
            this.alphaAction = 1
        }
        i.prototype.draw = function() {
            this.x += this.vx;
            if (this.alphaAction == 1) {
                if (this.alpha < this.maxAlpha) { this.alpha += 0.005 } else { this.alphaAction = -1 }
            } else {
                if (this.alpha > 0.2) { this.alpha -= 0.002 } else { this.alphaAction = 1 }
            }
            if (this.x + (this.particleSize * 2) >= f.rightWall) { this.x = this.x - f.rightWall }
            c.beginPath();
            c.fillStyle = "rgba(255,255,255," + this.alpha.toString() + ")";
            c.arc(this.x, this.y, this.particleSize, 0, Math.PI * 2, true);
            c.closePath();
            c.fill()
        };

        function b() {
            j();
            var l = 200;
            if (Object.keys(e).length > l) { f.density = 0 }
            for (var k = 0; k < f.density; k++) {
                if (Math.random() > 0.97) { new i() }
            }
            for (var k in e) { e[k].draw() }
            requestAnimationFrame(b)
        }
        b()
    },
    drawStarSwitch: function() {
        var k = this;
        var b = document.querySelector("#starSignCanvas");
        if (!b) {
            return
        }
        b.height = b.width = b.parentNode.clientHeight;
        var a = b.getContext("2d");
        var h = b.width / 2;
        var e = b.height / 2;
        var g = [{
            pos: [
                [h + 9, e - 89],
                [h + 64, e - 100],
                [h + 95, e - 67],
                [h + 100, e - 20],
                [h + 76, e + 15],
                [h + 37, e + 37],
                [h - 25, e + 62],
                [h - 60, e + 20],
                [h - 80, e - 24],
                [h - 85, e - 68],
                [h - 67, e - 109],
                [h - 28, e - 123]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "8-7", "9-8", "10-9", "11-10", "12-11", "12-1"]
        }, {
            pos: [
                [h + 46, e - 127],
                [h + 39, e - 84],
                [h + 32, e - 39],
                [h + 23, e + 17],
                [h + 14, e + 59],
                [h - 30, e + 30],
                [h - 60, e - 26],
                [h - 52, e - 68],
                [h - 9, e - 111],
                [h - 111, e - 64],
                [h + 78, e - 30],
                [h + 108, e - 55],
                [h + 100, e + 1]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "8-7", "9-8", "9-1", "11-10", "12-11", "13-11"]
        }, {
            pos: [
                [h + 68, e - 41],
                [h + 61, e - 93],
                [h - 7, e - 124],
                [h - 57, e - 113],
                [h - 66, e - 71],
                [h - 20, e - 42],
                [h + 35, e - 15],
                [h + 51, e + 27],
                [h + 3, e + 55],
                [h - 53, e + 42],
                [h - 75, e + 1],
                [h + 36, e - 141],
                [h - 37, e + 75]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "8-7", "9-8", "10-9", "11-10", "13-12"]
        }, {
            pos: [
                [h - 12, e - 138],
                [h + 51, e - 107],
                [h + 69, e - 46],
                [h + 46, e + 24],
                [h + 46, e + 75],
                [h - 26, e + 84],
                [h - 40, e + 26],
                [h - 80, e - 35],
                [h - 70, e - 100],
                [h + 5, e + 25],
                [h + 3, e - 12],
                [h + 33, e - 35],
                [h - 38, e - 40],
                [h + 0, e - 64]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "8-7", "9-8", "9-1", "10-4", "10-7", "11-10", "12-11", "13-12", "14-13"]
        }, {
            pos: [
                [h - 28, e - 129],
                [h + 7, e - 108],
                [h + 48, e - 109],
                [h + 64, e - 64],
                [h + 48, e - 30],
                [h + 53, e + 8],
                [h + 26, e + 39],
                [h - 29, e + 48],
                [h - 57, e + 17],
                [h - 97, e + 7],
                [h - 106, e - 43],
                [h - 80, e - 76],
                [h - 77, e - 116],
                [h - 20, e - 42],
                [h + 98, e + 66]
            ],
            line: ["2-1", "3-2", "5-4", "6-5", "9-8", "10-9", "12-11", "13-12", "14-1", "14-3", "14-4", "14-6", "14-7", "14-8", "14-10", "14-11", "14-13", "15-7"]
        }, {
            pos: [
                [h - 5, e - 132],
                [h - 9, e - 76],
                [h + 66, e - 90],
                [h + 51, e - 40],
                [h + 4, e + 12],
                [h - 49, e - 19],
                [h - 93, e - 72],
                [h - 47, e + 73],
                [h + 79, e + 50]
            ],
            line: ["2-1", "3-2", "4-3", "5-4", "6-5", "7-6", "7-2", "8-5", "9-5"]
        }];
        var c = {},
            l = {};
        var d = {
            index: 0,
            durtion: 100,
            time: 1000,
            ElasticEaseOut: function(o, m, v, u, n, r) {
                var q;
                if (o == 0) {
                    return m
                }
                if ((o /= u) == 1) {
                    return m + v
                }
                if (typeof r == "undefined") { r = u * 0.3 }
                if (!n || n < Math.abs(v)) {
                    n = v;
                    q = r / 4
                } else { q = r / (2 * Math.PI) * Math.asin(v / n) }
                return (n * Math.pow(2, -10 * o) * Math.sin((o * u - q) * (2 * Math.PI) / r) + v + m)
            }
        };
        var j = function(m) {
            this.context = m;
            this.angle = 2 / 3 * Math.random() * Math.PI;
            this.draw = function() {
                var x = this.x || h;
                var w = this.y || e;
                var o = this.scale || 0.2 + Math.random() / 6;
                this.scale = o;
                var n = 30 * o;
                var p = this.angle;
                var v = p,
                    u = p + 2 * Math.PI / 3,
                    t = p - 2 * Math.PI / 3;
                var s = p + Math.PI / 3,
                    q = p - Math.PI / 3;
                ang6 = p + Math.PI;
                var y = [v, u, t, s, q, ang6].map(function(r) {
                    return [x + n * Math.cos(r), w + n * Math.sin(r)]
                });
                var z = this.context;
                z.beginPath();
                z.moveTo(y[0][0], y[0][1]);
                z.lineTo(y[1][0], y[1][1]);
                z.lineTo(y[2][0], y[2][1]);
                z.closePath();
                z.fillStyle = "#fff";
                z.fill();
                z.beginPath();
                z.moveTo(y[3][0], y[3][1]);
                z.lineTo(y[4][0], y[4][1]);
                z.lineTo(y[5][0], y[5][1]);
                z.closePath();
                z.fillStyle = "#fff";
                z.fill()
            }
        };
        var f = function(m) {
            this.context = m;
            this.draw = function() {
                var o = this.context;
                var s = this.line;
                var r = s.split("-");
                var q = r[0] - 1,
                    t = r[1] - 1;
                var n = c[q],
                    p = c[t];
                o.beginPath();
                o.setLineDash([2, 2]);
                o.moveTo(n.x, n.y);
                o.lineTo(p.x, p.y);
                o.lineWidth = 1;
                o.strokeStyle = "#fff";
                o.stroke()
            }
        };
        var i = function() {
            var q = g[d.index];
            var u = q.pos;
            var s = q.line;
            u.forEach(function(w, v) {
                if (!c[v]) { c[v] = new j(a) }
                if (q.scale) { c[v].scale = q.scale } else { c[v].scale = null }
            });
            s.forEach(function(w, v) {
                if (!l[v]) { l[v] = new f(a) }
                l[v].line = w
            });
            var t = [],
                r = u.map(function(v) {
                    return v
                });
            if (!c[0].x && !c[0].y) { r.forEach(function() { t.push([h, e]) }) } else {
                if (d.index == 0) {
                    t = g[g.length - 1].pos.map(function(v) {
                        return v
                    })
                } else {
                    t = g[d.index - 1].pos.map(function(v) {
                        return v
                    })
                }
            }
            var o = r.length - t.length;
            if (o > 0) {
                for (var p = 0; p < o; p++) { t.push([h, e]) }
            }
            var n = 0;
            var m = function() {
                a.clearRect(0, 0, b.width, b.height);
                r.forEach(function(v, w) {
                    var y = d.ElasticEaseOut(n, t[w][0], v[0] - t[w][0], d.durtion);
                    var x = d.ElasticEaseOut(n, t[w][1], v[1] - t[w][1], d.durtion);
                    c[w].x = y;
                    c[w].y = x;
                    c[w].draw()
                });
                s.forEach(function(w, v) { l[v].draw() });
                n++;
                if (n <= d.durtion) { requestAnimationFrame(m) } else {
                    k.isRendering = false;
                    d.index++;
                    if (d.index >= g.length) { d.index = 0 }
                    setTimeout(function() {
                        k.starSignImgSwitch(d.index);
                        i()
                    }, d.time)
                }
            };
            k.isRendering = true;
            m()
        };
        i();
        return this
    },
    starSignImgSwitch: function(c) {
        var b = this;
        var a = document.querySelectorAll("#container img");
        var d = document.querySelector("#container .active");
        if (d) { d.classList.remove("active") }
        if (a[c]) { a[c].classList.add("active") }
    },
    init: function() {
        var a = document.querySelector("#container");
        if (a) {
            this.drawStarBg();
            this.drawStarSwitch();
            a.classList.add("inited")
        }
    }
}).init();
