// ==UserScript==
// @name         Pixel Bot BP Edition
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Flyink13, DarkKeks
// @match        https://pixel.vkforms.ru/*
// @downloadURL  https://rawgit.com/DarkKeks/PublicPixelBot/master/PixelBot_bp.user.js
// @updateURL    https://rawgit.com/DarkKeks/PublicPixelBot/master/PixelBot_bp.user.js
// @grant        none
// ==/UserScript==

function PixelBot() {
    window.PixelBot = PixelBot;

    PixelBot.pts = 30;
    PixelBot.tc = "rgb(0, 0, 0)";

    PixelBot.doCoordLog = true;

    PixelBot.url = {
        script: function() {
            return 'https://rawgit.com/DarkKeks/PublicPixelBot/master/PixelBot_bp.user.js' + '?v=' + Math.random();
        },
        image: function() {
            return 'https://i.imgur.com/LQbq3eq.png' + '?v=' + Math.random();
        }
    };

    PixelBot.state = document.createElement("div");
    PixelBot.state.onclick = PixelBot.reload;
    PixelBot.state.textContent = "Загрузка приложения...";
    Object.assign(PixelBot.state.style, {
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
    document.body.appendChild(PixelBot.state);


    PixelBot.loger = document.createElement("div");
    PixelBot.loger.onclick = PixelBot.reload;
    Object.assign(PixelBot.loger.style, {
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
    document.body.appendChild(PixelBot.loger);

    PixelBot.log = function(x) {
        PixelBot.loger.innerHTML += x + "<br>";
        PixelBot.loger.scrollTo(0, 10000);
    };

    PixelBot.setState = function(s) {
        PixelBot.state.innerHTML = "PixelBot " + s;
        PixelBot.log(s);
    };


    PixelBot.reloadImage = function() {
        PixelBot.img = new Image();
        PixelBot.img.crossOrigin = "Anonymous";
        PixelBot.img.onload = function() {
            PixelBot.setState("перезагрузил зону защиты.");
            if (PixelBot.inited) PixelBot.getFullData();
        };
        PixelBot.img.src = PixelBot.url.image();
    };

    PixelBot.canvasEvent = function(type, q) {
        if (!PixelBot.canvas) return;
        if (type == "mousewheel") {
            PixelBot.canvas.dispatchEvent(new WheelEvent("mousewheel", q));
        } else {
            PixelBot.canvas.dispatchEvent(new MouseEvent(type, q));
        }
    };

    PixelBot.canvasClick = function(x, y, color) {
        PixelBot.resetZoom();
        if (x > 795) {
            PixelBot.canvasMoveTo(795, 0);
            x = x - 795;
        } else {
            PixelBot.canvasMoveTo(0, 0);
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

        var pxColor = PixelBot.getColor(PixelBot.ctx.getImageData(x, y + 1, 1, 1).data, 0);
        var colorEl = document.querySelector('[style="background-color: ' + color + ';"]');
        if (!colorEl) {
            console.log("color error %c " + color, 'background:' + color + ';');
            PixelBot.setState("ошибка подбора цвета " + color);
            return;
        } else if (pxColor == color) {
            if(PixelBot.doCoordLog) {
                console.log("== " + x + "x" + y + "%c " + pxColor, 'background:' + pxColor + ';');
                PixelBot.setState("пропускаю " + (x + 1) + "x" + (y + 1) + " совпал цвет");
            } else {
                console.log("==");
                PixelBot.setState("пропускаю, совпал цвет");
            }
            return;
        } else {
            if(PixelBot.doCoordLog) {
                console.log(x + "x" + y + "%c " + pxColor + " > %c " + color, 'background:' + pxColor + ';', 'background:' + color + ';');
                PixelBot.setState("поставил точку " + (x + 1) + "x" + (y + 1));
            } else {
                console.log(" > ");
                PixelBot.setState("поставил точку");
            }
        }
        colorEl.click();
        PixelBot.canvasEvent("mousedown", q);
        PixelBot.canvasEvent("click", q);
        q.button = 0;
        PixelBot.canvasEvent("mouseup", q);
        document.querySelector(".App__confirm button").click();
    };

    PixelBot.draw = function() {
        var px = PixelBot.pixs.shift();
        if (!px) {
            PixelBot.setState("точек нет");
        } else {
            PixelBot.canvasClick(px[0], px[1], px[2]);
        }
    };

    PixelBot.canvasMove = function(x, y) {
        var q = {
            bubbles: true,
            cancelable: true,
            button: 1,
            clientX: 0,
            clientY: 0
        };
        PixelBot.canvasEvent("mousedown", q);
        q.clientY = y;
        q.clientX = x;
        PixelBot.canvasEvent("mousemove", q);
        PixelBot.canvasEvent("mouseup", q);
    };

    PixelBot.canvasMoveTo = function(x, y) {
        PixelBot.canvasMove(10000, 10000);
        PixelBot.canvasMove(-40 - x, -149 - y);
    };

    PixelBot.getImageData = function() {
        var data = PixelBot.ctx.getImageData(0, 1, 795, 400).data;
        return data;
    };

    PixelBot.getColor = function(data, i) {
        return "rgb(" + data[i] + ", " + data[i + 1] + ", " + data[i + 2] + ")";
    };

    PixelBot.getFullData = function() {
        PixelBot.pixs = [];
        PixelBot.pixs = PixelBot.randomShuffle(PixelBot.getData(0));
        PixelBot.setState("осталось точек:" + PixelBot.pixs.length);
        return PixelBot.pixs.length;
    };

    PixelBot.getData = function(offsetX) {
        PixelBot.resetZoom();
        PixelBot.canvasMoveTo(offsetX, 0);
        var id1 = PixelBot.getImageData();
        PixelBot.ctx.drawImage(PixelBot.img, -offsetX, 0);
        var id2 = PixelBot.getImageData();
        var data = [];
        for (var i = 0; i < id1.length; i += 4) {
            var x = offsetX + (i / 4) % 795,
                y = ~~((i / 4) / 795);
            if (PixelBot.getColor(id1, i) !== PixelBot.getColor(id2, i) && PixelBot.getColor(id2, i) !== PixelBot.tc) {
                data.push([x, y, PixelBot.getColor(id2, i), PixelBot.getColor(id1, i)]);
            }
        }
        return data;
    };

    PixelBot.randomShuffle = function(data) {
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

    PixelBot.resetZoom = function() {
        PixelBot.canvasEvent("mousewheel", {
            deltaY: 100000,
            deltaX: 0,
            clientX: 100,
            clientY: 100,
        });
    };

    PixelBot.init = function() {
        PixelBot.inited = 1;
        PixelBot.getFullData();
        PixelBot.setState("запущен.");
    };

    PixelBot.wait = setInterval(function() {
        if(document.querySelector(".App__advance > .Button.primary")) {
            document.querySelector(".App__advance > .Button.primary").click();
        } else if(document.querySelector(".Header__close")) {
            document.querySelector(".Header__close").click();
        } else if (!PixelBot.inited && PixelBot.canvas) {
            PixelBot.ctx = PixelBot.canvas.getContext("2d");
            PixelBot.init();
        } else if (PixelBot.canvas && document.querySelector(".Ttl__wait")) {
            PixelBot.timer = 1;
        } else if (!PixelBot.canvas) {
            PixelBot.canvas = document.querySelector("canvas");
        } else if (!PixelBot.pts) {
            PixelBot.reload();
            PixelBot.pts = 30;
        } else if (PixelBot.inited && PixelBot.canvas) {
            PixelBot.pts--;
            PixelBot.draw();
        }
    }, 1000);

    PixelBot.reload = function() {
        PixelBot.state.outerHTML = "";
        PixelBot.loger.outerHTML = "";
        clearInterval(PixelBot.wait);
        var script = document.createElement('script');
        script.src = PixelBot.url.script();
        document.body.appendChild(script);
    };

    PixelBot.gaInit = function() {
        var script = document.createElement('script');
        script.src = "https://www.googletagmanager.com/gtag/js?id=UA-108011374-1";
        script.setAttribute('asunc', '');
        (document.body || document.head || document.documentElement).appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-108011374-1');

        console.log("GA send.");
    };

    PixelBot.reloadImage();
    PixelBot.gaInit();
    console.log("PixelBot loaded");
}

if (window.loaded) {
    PixelBot();
} else {
    var inject = function() {
        window.loaded = 1;
        var script = document.createElement('script');
        script.appendChild(document.createTextNode('(' + PixelBot + ')();'));
        (document.body || document.head || document.documentElement).appendChild(script);
    };

    //if (document.readyState == 'complete') inject();
    window.addEventListener("load", function() {
        inject();
    });
}