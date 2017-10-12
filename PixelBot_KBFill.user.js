// ==UserScript==
// @name         Pixel Bot Fill KB
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  try to take over the world!
// @author       Flyink13, DarkKeks
// @match        https://pixel.vkforms.ru/*
// @downloadURL  https://raw.githubusercontent.com/DarkKeks/PublicPixelBot/master/PixelBot_KBFill.user.js
// @updateURL    https://raw.githubusercontent.com/DarkKeks/PublicPixelBot/master/PixelBot_KBFill.user.js
// @grant        none
// ==/UserScript==

function MyPixelBot() {
    window.MyPixelBot = MyPixelBot;

    MyPixelBot.url = {
        script: 'https://raw.githubusercontent.com/DarkKeks/PublicPixelBot/master/PixelBot_KBFill.user.js',
        image:  'https://i.imgur.com/uYzm0QG.png'
    };

    MyPixelBot.refreshTime = 300;

    MyPixelBot.pts = 30;
    MyPixelBot.tc = "rgb(0, 0, 0)";

    MyPixelBot.debug = false;
    MyPixelBot.doCoordLog = true;

    MyPixelBot.urlGen = {
        script: function() {
            return MyPixelBot.url.script + '?v=' + Math.random();
        },
        image: function() {
            return MyPixelBot.url.image;
        }
    };

    MyPixelBot.state = document.createElement("div");
    MyPixelBot.state.onclick = MyPixelBot.reload;
    MyPixelBot.state.textContent = "Загрузка приложения...";
    Object.assign(MyPixelBot.state.style, {
        background: "rgba(0,0,0,0.5)",
        bottom: "0px",
        right: "0px",
        width: "100%",
        height: "100%",
        lineHeight: "500px",
        textAlign: "center",
        color: "#fff",
        position: "fixed",
        zIndex: 10000
    });
    document.body.appendChild(MyPixelBot.state);


    MyPixelBot.loger = document.createElement("div");
    MyPixelBot.loger.onclick = MyPixelBot.reload;
    Object.assign(MyPixelBot.loger.style, {
        background: "rgba(0,0,0,0)",
        top: "0px",
        left: "0px",
        width: "250px",
        height: "100%",
        color: "#fff",
        position: "fixed",
        borderRight: "1px solid #fff",
        fontSize: "11px",
        padding: "12px",
        zIndex: 10001
    });
    document.body.appendChild(MyPixelBot.loger);

    MyPixelBot.log = function(x) {
        MyPixelBot.loger.innerHTML += x + "<br>";
        MyPixelBot.loger.scrollTo(0, 10000);
    };

    MyPixelBot.setState = function(s) {
        MyPixelBot.state.innerHTML = "MyPixelBot " + s;
        MyPixelBot.log(s);
    };


    MyPixelBot.reloadImage = function() {
        MyPixelBot.img = new Image();
        MyPixelBot.img.crossOrigin = "Anonymous";
        MyPixelBot.img.onload = function() {
            MyPixelBot.setState("Перезагрузил зону защиты.");
            if (MyPixelBot.inited) MyPixelBot.getFullData();
        };
        MyPixelBot.img.src = MyPixelBot.urlGen.image();
    };

    MyPixelBot.canvasEvent = function(type, q) {
        if (!MyPixelBot.canvas) return;
        if (type == "mousewheel") {
            MyPixelBot.canvas.dispatchEvent(new WheelEvent("mousewheel", q));
        } else {
            MyPixelBot.canvas.dispatchEvent(new MouseEvent(type, q));
        }
    };

    MyPixelBot.canvasClick = function(x, y, color) {
        var offset = 0;
        MyPixelBot.resetZoom();
        if (x > 795) {
            MyPixelBot.canvasMoveTo(795, 0);
            offset = 795;
            x = x - offset;
        } else {
            MyPixelBot.canvasMoveTo(0, 0);
        }
        var q = {
            bubbles: true,
            cancelable: true,
            button: 1,
            clientX: x,
            clientY: y + 1,
            layerX: x,
            layerY: y + 1
        };

        var pxColor = MyPixelBot.getColor(MyPixelBot.ctx.getImageData(x, y + 1, 1, 1).data, 0);
        var colorEl = document.querySelectorAll('[style="background-color: ' + color + ';"]')[0];
        if (!colorEl) {
            console.log("color error %c " + color, 'background:' + color + ';');
            MyPixelBot.setState("Ошибка подбора цвета " + color);
            return;
        } else if (pxColor == color) {
            if(MyPixelBot.doCoordLog) {
                console.log("== " + x + offset  + "x" + y + "%c " + pxColor, 'background:' + pxColor + ';');
                MyPixelBot.setState("Пропускаю " + (x + offset + 1) + "x" + (y + 1) + " совпал цвет");
            } else {
                console.log("==");
                MyPixelBot.setState("Пропускаю, совпал цвет");
            }
            return;
        } else {
            if(MyPixelBot.doCoordLog) {
                console.log(x + offset  + "x" + y + "%c " + pxColor + " -> %c " + color, 'background:' + pxColor + ';', 'background:' + color + ';');
                MyPixelBot.setState("Поставил точку " + (x + offset + 1) + "x" + (y + 1));
            } else {
                console.log(" -> ");
                MyPixelBot.setState("Поставил точку");
            }
        }
        colorEl.click();
        MyPixelBot.canvasEvent("mousedown", q);
        MyPixelBot.canvasEvent("click", q);
        q.button = 0;
        MyPixelBot.canvasEvent("mouseup", q);
        document.querySelectorAll(".App__confirm button")[0].click();
    };

    MyPixelBot.draw = function() {
        var px = MyPixelBot.pixs.shift();
        if (!px) {
            MyPixelBot.setState("Точек нет");
        } else {
            MyPixelBot.canvasClick(px[0], px[1], px[2]);
        }
    };

    MyPixelBot.canvasMove = function(x, y) {
        var q = {
            bubbles: true,
            cancelable: true,
            button: 1,
            clientX: 0,
            clientY: 0
        };
        MyPixelBot.canvasEvent("mousedown", q);
        q.clientY = y;
        q.clientX = x;
        MyPixelBot.canvasEvent("mousemove", q);
        MyPixelBot.canvasEvent("mouseup", q);
    };

    MyPixelBot.canvasMoveTo = function(x, y) {
        MyPixelBot.canvasMove(10000, 10000);
        MyPixelBot.canvasMove(-40 - x, -149 - y);
    };

    MyPixelBot.getImageData = function() {
        var data = MyPixelBot.ctx.getImageData(0, 1, 795, 400).data;
        return data;
    };

    MyPixelBot.getColor = function(data, i) {
        return "rgb(" + data[i] + ", " + data[i + 1] + ", " + data[i + 2] + ")";
    };

    MyPixelBot.getFullData = function() {
        MyPixelBot.pixs = [];
        MyPixelBot.pixs = MyPixelBot.randomShuffle(MyPixelBot.getData(0)
            .concat(MyPixelBot.getData(795)));
        MyPixelBot.setState("осталось точек:" + MyPixelBot.pixs.length);
        return MyPixelBot.pixs.length;
    };

    MyPixelBot.getData = function(offsetX) {
        MyPixelBot.resetZoom();
        MyPixelBot.canvasMoveTo(offsetX, 0);
        var id1 = MyPixelBot.getImageData();
        MyPixelBot.ctx.drawImage(MyPixelBot.img, -offsetX, 1);
        var id2 = MyPixelBot.getImageData();
        var data = [];
        for (var i = 0; i < id1.length; i += 4) {
            var x = offsetX + (i / 4) % 795,
                y = ~~((i / 4) / 795);
            if (MyPixelBot.getColor(id1, i) !== MyPixelBot.getColor(id2, i) && MyPixelBot.getColor(id2, i) !== MyPixelBot.tc) {
                data.push([x, y, MyPixelBot.getColor(id2, i), MyPixelBot.getColor(id1, i)]);
            }
        }
        return data;
    };

    MyPixelBot.randomShuffle = function(data) {
        var currentIndex = data.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = data[currentIndex];
            data[currentIndex] = data[randomIndex];
            data[randomIndex] = temporaryValue;
        }
        return data;
    };

    MyPixelBot.resetZoom = function() {
        MyPixelBot.canvasEvent("mousewheel", {
            deltaY: 100000,
            deltaX: 0,
            clientX: 100,
            clientY: 100,
        });
    };

    MyPixelBot.init = function() {
        MyPixelBot.inited = 1;
        MyPixelBot.getFullData();
        MyPixelBot.setState("Запущен.");
    };

    MyPixelBot.wait = setInterval(function() {
        if(MyPixelBot.debug)
            debugger;
        if (window.localStorage.getItem('DROP_FIRST_TIME') != '1') {
            document.querySelectorAll(".App__advance > .Button.primary")[0].click();
        } else if (window.localStorage.getItem('DROP_HEADER') != '1') {
            document.querySelectorAll(".Header__close")[0].click();
        } else if (!MyPixelBot.inited && MyPixelBot.canvas) {
            MyPixelBot.ctx = MyPixelBot.canvas.getContext("2d");
            MyPixelBot.init();
        } else if (MyPixelBot.canvas && document.querySelectorAll(".Ttl > .Ttl__wait").length) {
            MyPixelBot.timer = 1;
        } else if (!MyPixelBot.canvas) {
            var all = document.querySelectorAll("canvas");
            for(var i = 0; i < all.length; ++i) {
                if(all[i].style.display != 'none') {
                    MyPixelBot.canvas = all[i];
                }
            }
        } else if (!MyPixelBot.pts) {
            MyPixelBot.reload();
            MyPixelBot.pts = 30;
        } else if (MyPixelBot.inited && MyPixelBot.canvas) {
            MyPixelBot.pts--;
            MyPixelBot.draw();
        }
    }, 1000);

    MyPixelBot.refresh = setTimeout(function() {
        location.reload();
    }, MyPixelBot.refreshTime * 1e3);

    MyPixelBot.reload = function() {
        MyPixelBot.state.outerHTML = "";
        MyPixelBot.loger.outerHTML = "";
        clearInterval(MyPixelBot.wait);
        var script = document.createElement('script');
        script.src = MyPixelBot.urlGen.script();
        document.body.appendChild(script);
    };

    MyPixelBot.reloadImage();
    console.log("MyPixelBot loaded");
}

if (window.loaded) {
    MyPixelBot();
} else {
    var inject = function() {
        window.loaded = 1;
        var script = document.createElement('script');
        script.appendChild(document.createTextNode('(' + MyPixelBot + ')();'));
        (document.body || document.head || document.documentElement).appendChild(script);
    };

    if (document.readyState == 'complete') {
        inject();
    } else {
        window.addEventListener("load", function() {
            inject();
        });
    }
}