// ==UserScript==
// @name         Pixel Bot Loader
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  try to take over the world!
// @author       DarkKeks
// @match        https://pixel.vkforms.ru/*
// @downloadURL  https://rawgit.com/DarkKeks/PublicPixelBot/master/PixelBotLoader.user.js
// @updateURL    https://rawgit.com/DarkKeks/PublicPixelBot/master/PixelBotLoader.user.js
// @grant        none
// ==/UserScript==

window.botUrl = "https://cdn.rawgit.com/DarkKeks/PublicPixelBot/c95d043c/PixelBot.user.js";

var inject = function() {
    console.log("Injecting");
    var script = document.createElement('script');
    script.src = window.botUrl + '?v=' + Math.random();
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