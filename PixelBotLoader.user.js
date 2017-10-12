// ==UserScript==
// @name         Pixel Bot Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       DarkKeks
// @match        https://pixel.vkforms.ru/*
// @downloadURL  https://github.com/DarkKeks/PublicPixelBot/blob/master/PixelBotLoader.user.js
// @updateURL    https://github.com/DarkKeks/PublicPixelBot/blob/master/PixelBotLoader.user.js
// @grant        none
// ==/UserScript==

var inject = function() {
    var script = document.createElement('script');
    script.src = 'https://github.com/DarkKeks/PublicPixelBot/blob/master/PixelBot.user.js' + '?v=' + Math.random();
    document.body.appendChild(script);
    (document.body || document.head || document.documentElement).appendChild(script);
};

if (document.readyState == 'complete') {
    inject();
} else {
    window.addEventListener("load", function() {
        inject();
    });
}