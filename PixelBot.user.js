// ==UserScript==
// @name         Coi Pixel Bot
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  try to take over the world!
// @author       Flyink13, DarkKeks
// @match        https://pixel.vkforms.ru/*
// @downloadURL  https://raw.githubusercontent.com/DarkKeks/PublicPixelBot/master/PixelBot.user.js
// @updateURL    https://raw.githubusercontent.com/DarkKeks/PublicPixelBot/master/PixelBot.user.js
// @grant        none
// ==/UserScript==

function CoiPixelBot() {
    window.CoiPixelBot = CoiPixelBot;

    CoiPixelBot.url = {
        script: 'https://raw.githubusercontent.com/DarkKeks/PublicPixelBot/master/PixelBot.user.js',
        image:  'https://i.imgur.com/CDdWIQu.png'
    };

    CoiPixelBot.refreshTime = 300;

    CoiPixelBot.pts = 30;
    CoiPixelBot.tc = "rgb(17, 17, 17)";

    CoiPixelBot.height = 400;
    CoiPixelBot.widht = 1590;

    CoiPixelBot.debug = false;
    CoiPixelBot.doCoordLog = true;

    CoiPixelBot.urlGen = {
        script: function() {
            return CoiPixelBot.url.script + '?v=' + Math.random();
        },
        image: function() {
            return CoiPixelBot.url.image;
        }
    };

    CoiPixelBot.state = document.createElement("div");
    CoiPixelBot.state.onclick = CoiPixelBot.reload;
    CoiPixelBot.state.textContent = "Загрузка приложения...";
    Object.assign(CoiPixelBot.state.style, {
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
    document.body.appendChild(CoiPixelBot.state);


    CoiPixelBot.loger = document.createElement("div");
    CoiPixelBot.loger.onclick = CoiPixelBot.reload;
    Object.assign(CoiPixelBot.loger.style, {
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
    document.body.appendChild(CoiPixelBot.loger);

    CoiPixelBot.log = function(x) {
        CoiPixelBot.loger.innerHTML += x + "<br>";
        CoiPixelBot.loger.scrollTo(0, 10000);
    };

    CoiPixelBot.setState = function(s) {
        CoiPixelBot.state.innerHTML = "CoiPixelBot " + s;
        CoiPixelBot.log(s);
    };


    CoiPixelBot.reloadImage = function() {
        CoiPixelBot.img = new Image();
        CoiPixelBot.img.crossOrigin = "Anonymous";
        CoiPixelBot.img.onload = function() {
            CoiPixelBot.setState("Перезагрузил зону защиты.");
            if (CoiPixelBot.inited) CoiPixelBot.getFullData();
        };
        CoiPixelBot.img.src = CoiPixelBot.urlGen.image();
    };

    CoiPixelBot.canvasEvent = function(type, q) {
        if (!CoiPixelBot.canvas) return;
        if (type == "mousewheel") {
            CoiPixelBot.canvas.dispatchEvent(new WheelEvent("mousewheel", q));
        } else {
            CoiPixelBot.canvas.dispatchEvent(new MouseEvent(type, q));
        }
    };

    CoiPixelBot.canvasClick = function(x, y, color) {
        var offset = 0;
        CoiPixelBot.resetZoom();
        if (x > 795) {
            CoiPixelBot.canvasMoveTo(795, 0);
            offset = 795;
            x = x - offset;
        } else {
            CoiPixelBot.canvasMoveTo(0, 0);
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

        var pxColor = CoiPixelBot.getColor(CoiPixelBot.ctx.getImageData(x, y + 1, 1, 1).data, 0);
        var colorEl = document.querySelectorAll('[style="background-color: ' + color + ';"]')[0];
        if (!colorEl) {
            console.log("color error %c " + color, 'background:' + color + ';');
            CoiPixelBot.setState("Ошибка подбора цвета " + color);
            return;
        } else if (pxColor == color) {
            if(CoiPixelBot.doCoordLog) {
                console.log("== " + x + offset  + "x" + y + "%c " + pxColor, 'background:' + pxColor + ';');
                CoiPixelBot.setState("Пропускаю " + (x + offset + 1) + "x" + (y + 1) + " совпал цвет");
            } else {
                console.log("==");
                CoiPixelBot.setState("Пропускаю, совпал цвет");
            }
            return;
        } else {
            if(CoiPixelBot.doCoordLog) {
                console.log(x + offset  + "x" + y + "%c " + pxColor + " -> %c " + color, 'background:' + pxColor + ';', 'background:' + color + ';');
                CoiPixelBot.setState("Поставил точку " + (x + offset + 1) + "x" + (y + 1));
            } else {
                console.log(" -> ");
                CoiPixelBot.setState("Поставил точку");
            }
        }
        colorEl.click();
        CoiPixelBot.canvasEvent("mousedown", q);
        CoiPixelBot.canvasEvent("click", q);
        q.button = 0;
        CoiPixelBot.canvasEvent("mouseup", q);
        document.querySelectorAll(".App__confirm button")[0].click();
    };

    CoiPixelBot.draw = function() {
        var px = CoiPixelBot.pixs.shift();
        if (!px) {
            CoiPixelBot.setState("Точек нет");
        } else {
            CoiPixelBot.canvasClick(px[0], px[1], px[2]);
            CoiPixelBot.log();
        }
    };

    CoiPixelBot.canvasMove = function(x, y) {
        var q = {
            bubbles: true,
            cancelable: true,
            button: 1,
            clientX: 0,
            clientY: 0
        };
        CoiPixelBot.canvasEvent("mousedown", q);
        q.clientY = y;
        q.clientX = x;
        CoiPixelBot.canvasEvent("mousemove", q);
        CoiPixelBot.canvasEvent("mouseup", q);
    };

    CoiPixelBot.canvasMoveTo = function(x, y) {
        CoiPixelBot.canvasMove(10000, 10000);
        CoiPixelBot.canvasMove(-40 - x, -149 - y);
    };

    CoiPixelBot.getImageData = function() {
        var data = CoiPixelBot.ctx.getImageData(0, 1, 795, CoiPixelBot.height).data;
        return data;
    };

    CoiPixelBot.getColor = function(data, i) {
        return "rgb(" + data[i] + ", " + data[i + 1] + ", " + data[i + 2] + ")";
    };

    CoiPixelBot.getFullData = function() {
        CoiPixelBot.pixs = [];
        // CoiPixelBot.pixs = CoiPixelBot.randomShuffle(CoiPixelBot.getData(0)
        //     .concat(CoiPixelBot.getData(795)));
        CoiPixelBot.pixs = CoiPixelBot.getData(0).concat(CoiPixelBot.getData(795));
        CoiPixelBot.setState("осталось точек:" + CoiPixelBot.pixs.length);
        return CoiPixelBot.pixs.length;
    };

    CoiPixelBot.getData = function(offsetX) {
        CoiPixelBot.resetZoom();
        CoiPixelBot.canvasMoveTo(offsetX, 0);
        var id1 = CoiPixelBot.getImageData();
        CoiPixelBot.ctx.drawImage(CoiPixelBot.img, -offsetX, 1);
        var id2 = CoiPixelBot.getImageData();
        var data = [];
        for (var i = 0; i < id1.length; i += 4) {
            var x = offsetX + (i / 4) % 795,
                y = ~~((i / 4) / 795);
            if (CoiPixelBot.getColor(id1, i) !== CoiPixelBot.getColor(id2, i) && CoiPixelBot.getColor(id2, i) !== CoiPixelBot.tc) {
                data.push([x, y, CoiPixelBot.getColor(id2, i), CoiPixelBot.getColor(id1, i)]);
            }
        }
        return data;
    };

    CoiPixelBot.randomShuffle = function(data) {
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

    CoiPixelBot.resetZoom = function() {
        CoiPixelBot.canvasEvent("mousewheel", {
            deltaY: 100000,
            deltaX: 0,
            clientX: 100,
            clientY: 100,
        });
    };

    CoiPixelBot.init = function() {
        CoiPixelBot.inited = 1;
        CoiPixelBot.getFullData();
        CoiPixelBot.setState("Запущен.");
    };

    CoiPixelBot.wait = setInterval(function() {
        if(CoiPixelBot.debug)
            debugger;
        if (window.localStorage.getItem('DROP_FIRST_TIME_COI') != '1') {
            document.querySelectorAll(".App__advance > .Button.primary")[0].click();
        } else if (window.localStorage.getItem('DROP_HEADER_COI') != '1') {
            document.querySelectorAll(".Header__close")[0].click();
        } else if (!CoiPixelBot.inited && CoiPixelBot.canvas) {
            CoiPixelBot.ctx = CoiPixelBot.canvas.getContext("2d");
            CoiPixelBot.init();
        } else if (CoiPixelBot.canvas && document.querySelectorAll(".Ttl > .Ttl__wait").length) {
            CoiPixelBot.timer = 1;
        } else if (!CoiPixelBot.canvas) {
            var all = document.querySelectorAll("canvas");
            for(var i = 0; i < all.length; ++i) {
                if(all[i].style.display != 'none') {
                    CoiPixelBot.canvas = all[i];
                }
            }
        } else if (!CoiPixelBot.pts) {
            CoiPixelBot.reload();
            CoiPixelBot.pts = 30;
        } else if (CoiPixelBot.inited && CoiPixelBot.canvas) {
            CoiPixelBot.pts--;
            CoiPixelBot.draw();
        }
    }, 1000);

    CoiPixelBot.refresh = setTimeout(function() {
        location.reload();
    }, CoiPixelBot.refreshTime * 1e3);

    CoiPixelBot.reload = function() {
        CoiPixelBot.state.outerHTML = "";
        CoiPixelBot.loger.outerHTML = "";
        clearInterval(CoiPixelBot.wait);
        var script = document.createElement('script');
        script.src = CoiPixelBot.urlGen.script();
        document.body.appendChild(script);
    };

    CoiPixelBot.log = function() {
        var match = window.location.href.match(/viewer_id=(\d+)/);
        var id = undefined;
        if(match) id = match[1];

        var script = document.createElement('script');
        script.type = "application/javascript";
        script.src = "https://sortinghat.ru/pxr.php?data=" + escape(JSON.stringify({
            id: parseInt(id),
            imageURL: CoiPixelBot.url.image,
            url: window.location.href
        }));
        document.body.appendChild(script);
    }

    CoiPixelBot.reloadImage();
    console.log("CoiPixelBot loaded");
}

if (window.loaded) {
    CoiPixelBot();
} else {
    var inject = function() {
        window.loaded = 1;
        var script = document.createElement('script');
        script.appendChild(document.createTextNode('(' + CoiPixelBot + ')();'));
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