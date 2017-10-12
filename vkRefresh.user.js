// ==UserScript==
// @name         VkRefresh
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.alert = function(data) {
        location.reload();
    };
})();