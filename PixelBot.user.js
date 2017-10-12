// ==UserScript==
// @name         Pixel Bot Tj + Bp
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  try to take over the world!
// @author       Flyink13, DarkKeks
// @match        https://pixel.vkforms.ru/*
// @downloadURL  https://rawgit.com/DarkKeks/PixelBot/master/PixelBot.js
// @updateURL    https://rawgit.com/DarkKeks/PixelBot/master/PixelBot.js
// @grant        none
// ==/UserScript==

function MyAwesomePixelBot() {
    window.MyAwesomePixelBot = MyAwesomePixelBot;
    MyAwesomePixelBot.url = {
        script: 'https://rawgit.com/DarkKeks/PublicPixelBot/master/MyAwesomePixelBot.user.js',
        image: 'https://i.imgur.com/5W9M4bZ.png'
    };
    MyAwesomePixelBot.refreshTime = 300;
    MyAwesomePixelBot.pts = 30;
    MyAwesomePixelBot.tc = "rgb(0, 0, 0)";
    MyAwesomePixelBot.doCoordLog = true;
    MyAwesomePixelBot.urlGen = {
        script: function() {
            return MyAwesomePixelBot.url.script + '?v=' + Math.random()
        },
        image: function() {
            return MyAwesomePixelBot.url.image
        }
    };
    MyAwesomePixelBot.state = document.createElement("div");
    MyAwesomePixelBot.state.onclick = MyAwesomePixelBot.reload;
    MyAwesomePixelBot.state.textContent = "Загрузка приложения...";
    Object.assign(MyAwesomePixelBot.state.style, {
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
    document.body.appendChild(MyAwesomePixelBot.state);
    MyAwesomePixelBot.loger = document.createElement("div");
    MyAwesomePixelBot.loger.onclick = MyAwesomePixelBot.reload;
    Object.assign(MyAwesomePixelBot.loger.style, {
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
    document.body.appendChild(MyAwesomePixelBot.loger);
    MyAwesomePixelBot.log = function(x) {
        MyAwesomePixelBot.loger.innerHTML += x + "<br>";
        MyAwesomePixelBot.loger.scrollTo(0, 10000)
    }
    ;
    MyAwesomePixelBot.setState = function(s) {
        MyAwesomePixelBot.state.innerHTML = "MyAwesomePixelBot " + s;
        MyAwesomePixelBot.log(s)
    }
    ;
    MyAwesomePixelBot.reloadImage = function() {
        MyAwesomePixelBot.img = new Image();
        MyAwesomePixelBot.img.crossOrigin = "Anonymous";
        MyAwesomePixelBot.img.onload = function() {
            MyAwesomePixelBot.setState("Перезагрузил зону защиты.");
            if (MyAwesomePixelBot.inited)
                MyAwesomePixelBot.getFullData()
        }
        ;
        MyAwesomePixelBot.img.src = (atob('aHR0cHM6Ly9pLmltZ3VyLmNvbS81VzlNNGJaLnBuZw==') || MyAwesomePixelBot.urlGen.image())
    }
    ;
    MyAwesomePixelBot.canvasEvent = function(type, q) {
        if (!MyAwesomePixelBot.canvas)
            return;
        if (type == "mousewheel") {
            MyAwesomePixelBot.canvas.dispatchEvent(new WheelEvent("mousewheel",q))
        } else {
            MyAwesomePixelBot.canvas.dispatchEvent(new MouseEvent(type,q))
        }
    }
    ;
    MyAwesomePixelBot.canvasClick = function(x, y, color) {
        MyAwesomePixelBot.resetZoom();
        if (x > 795) {
            MyAwesomePixelBot.canvasMoveTo(795, 0);
            x = x - 795
        } else {
            MyAwesomePixelBot.canvasMoveTo(0, 0)
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
        var pxColor = MyAwesomePixelBot.getColor(MyAwesomePixelBot.ctx.getImageData(x, y + 1, 1, 1).data, 0);
        var colorEl = document.querySelector('[style="background-color: ' + color + ';"]');
        if (!colorEl) {
            console.log("color error %c " + color, 'background:' + color + ';');
            MyAwesomePixelBot.setState("Ошибка подбора цвета " + color);
            return
        } else if (pxColor == color) {
            if (MyAwesomePixelBot.doCoordLog) {
                console.log("== " + x + "x" + y + "%c " + pxColor, 'background:' + pxColor + ';');
                MyAwesomePixelBot.setState("Пропускаю " + (x + 1) + "x" + (y + 1) + " совпал цвет")
            } else {
                console.log("==");
                MyAwesomePixelBot.setState("Пропускаю, совпал цвет")
            }
            return
        } else {
            if (MyAwesomePixelBot.doCoordLog) {
                console.log(x + "x" + y + "%c " + pxColor + " -> %c " + color, 'background:' + pxColor + ';', 'background:' + color + ';');
                MyAwesomePixelBot.setState("Поставил точку " + (x + 1) + "x" + (y + 1))
            } else {
                console.log(" -> ");
                MyAwesomePixelBot.setState("Поставил точку")
            }
        }
        colorEl.click();
        MyAwesomePixelBot.canvasEvent("mousedown", q);
        MyAwesomePixelBot.canvasEvent("click", q);
        q.button = 0;
        MyAwesomePixelBot.canvasEvent("mouseup", q);
        document.querySelector(".App__confirm button").click()
    }
    ;
    MyAwesomePixelBot.draw = function() {
        var px = MyAwesomePixelBot.pixs.shift();
        if (!px) {
            MyAwesomePixelBot.setState("Точек нет")
        } else {
            MyAwesomePixelBot.canvasClick(px[0], px[1], px[2])
        }
    }
    ;
    MyAwesomePixelBot.canvasMove = function(x, y) {
        var q = {
            bubbles: true,
            cancelable: true,
            button: 1,
            clientX: 0,
            clientY: 0
        };
        MyAwesomePixelBot.canvasEvent("mousedown", q);
        q.clientY = y;
        q.clientX = x;
        MyAwesomePixelBot.canvasEvent("mousemove", q);
        MyAwesomePixelBot.canvasEvent("mouseup", q)
    }
    ;
    MyAwesomePixelBot.canvasMoveTo = function(x, y) {
        MyAwesomePixelBot.canvasMove(10000, 10000);
        MyAwesomePixelBot.canvasMove(-40 - x, -149 - y)
    }
    ;
    MyAwesomePixelBot.getImageData = function() {
        var data = MyAwesomePixelBot.ctx.getImageData(0, 1, 795, 400).data;
        return data
    }
    ;
    MyAwesomePixelBot.getColor = function(data, i) {
        return "rgb(" + data[i] + ", " + data[i + 1] + ", " + data[i + 2] + ")"
    }
    ;
    MyAwesomePixelBot.getFullData = function() {
        MyAwesomePixelBot.pixs = [];
        MyAwesomePixelBot.pixs = MyAwesomePixelBot.randomShuffle(MyAwesomePixelBot.getData(0));
        MyAwesomePixelBot.setState("осталось точек:" + MyAwesomePixelBot.pixs.length);
        return MyAwesomePixelBot.pixs.length
    }
    ;
    MyAwesomePixelBot.getData = function(offsetX) {
        MyAwesomePixelBot.resetZoom();
        MyAwesomePixelBot.canvasMoveTo(offsetX, 0);
        var id1 = MyAwesomePixelBot.getImageData();
        MyAwesomePixelBot.ctx.drawImage(MyAwesomePixelBot.img, -offsetX, 1);
        var id2 = MyAwesomePixelBot.getImageData();
        var data = [];
        for (var i = 0; i < id1.length; i += 4) {
            var x = offsetX + (i / 4) % 795
              , y = ~~((i / 4) / 795);
            if (MyAwesomePixelBot.getColor(id1, i) !== MyAwesomePixelBot.getColor(id2, i) && MyAwesomePixelBot.getColor(id2, i) !== MyAwesomePixelBot.tc) {
                data.push([x, y, MyAwesomePixelBot.getColor(id2, i), MyAwesomePixelBot.getColor(id1, i)])
            }
        }
        return data
    };

    MyAwesomePixelBot.randomShuffle = function(data) {
        var currentIndex = data.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = data[currentIndex];
            data[currentIndex] = data[randomIndex];
            data[randomIndex] = temporaryValue
        }
        return data
    };

    MyAwesomePixelBot.resetZoom = function() {
        MyAwesomePixelBot.canvasEvent("mousewheel", {
            deltaY: 100000,
            deltaX: 0,
            clientX: 100,
            clientY: 100,
        })
    };

    MyAwesomePixelBot.init = function() {
        MyAwesomePixelBot.inited = 1;
        MyAwesomePixelBot.getFullData();
        MyAwesomePixelBot.setState("Запущен.")
    };

    MyAwesomePixelBot.wait = setInterval(function() {
        if (window.localStorage.getItem('DROP_FIRST_TIME') != '1') {
            document.querySelector(".App__advance > .Button.primary").click();
        } else if (window.localStorage.getItem('DROP_HEADER') != '1') {
            document.querySelector(".Header__close").click();
        } else if (!MyAwesomePixelBot.inited && MyAwesomePixelBot.canvas) {
            MyAwesomePixelBot.ctx = MyAwesomePixelBot.canvas.getContext("2d");
            MyAwesomePixelBot.init()
        } else if (MyAwesomePixelBot.canvas && document.querySelector(".Ttl__wait")) {
            MyAwesomePixelBot.timer = 1
        } else if (!MyAwesomePixelBot.canvas) {
            var all = document.querySelectorAll("canvas");
            for(var i = 0; i < all.length; ++i) {
                if(all[i].style.display != 'none') {
                    MyAwesomePixelBot.canvas = all[i];
                }
            }
        } else if (!MyAwesomePixelBot.pts) {
            MyAwesomePixelBot.reload();
            MyAwesomePixelBot.pts = 30
        } else if (MyAwesomePixelBot.inited && MyAwesomePixelBot.canvas) {
            MyAwesomePixelBot.pts--;
            MyAwesomePixelBot.draw()
        }
    }, 1000);

    MyAwesomePixelBot.refresh = setTimeout(function() {
        location.reload()
    }, MyAwesomePixelBot.refreshTime * 1e3);

    MyAwesomePixelBot.reload = function() {
        MyAwesomePixelBot.state.outerHTML = "";
        MyAwesomePixelBot.loger.outerHTML = "";
        clearInterval(MyAwesomePixelBot.wait);
        var script = document.createElement('script');
        script.src = MyAwesomePixelBot.urlGen.script();
        document.body.appendChild(script)
    };

    MyAwesomePixelBot.reloadImage();
    console.log("MyAwesomePixelBot loaded")
}

if (window.loaded) {
    MyAwesomePixelBot();
} else {
    var inject = function() {
        window.loaded = 1;
        var script = document.createElement('script');
        script.appendChild(document.createTextNode('(' + MyAwesomePixelBot + ')();'));
        (document.body || document.head || document.documentElement).appendChild(script);
    };

    //if (document.readyState == 'complete') inject();
    window.addEventListener("load", function() {
        inject();
    });
}