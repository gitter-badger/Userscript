// ==UserScript==
// @name        Javascript-css beautify
// @namespace   http://devs.forumvi.com
// @description Beautify and syntax highlight javascript/css source code
// @version     2.3.0
// @author      Zzbaivong
// @resource    light https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.1.0/styles/github-gist.min.css
// @resource    dark https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.1.0/styles/monokai-sublime.min.css
// @require     https://openuserjs.org/src/libs/baivong/beautify-js.min.js
// @require     https://openuserjs.org/src/libs/baivong/beautify-css.min.js
// @require     https://openuserjs.org/src/libs/baivong/highlight-css-js.min.js
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_getResourceText
// ==/UserScript==

(function () {

    'use strict';

    var theme = 'light', // light|dark

        url = window.top.location.pathname,
        doc = document,
        contenttype = doc.contentType;

    function scrollByDragging(container) {

        function mouseUp(e) {
            if (e.which !== 3) return;

            window.removeEventListener('mousemove', mouseMove, 0);
            container.style.cursor = 'auto';
        }

        function mouseDown(e) {
            if (e.which !== 3) return;

            pos = {
                x: e.clientX,
                y: e.clientY
            };

            window.addEventListener('mousemove', mouseMove, 0);
            container.style.cursor = 'move';
        }

        function mouseMove(e) {
            container.scrollLeft -= (-pos.x + (pos.x = e.clientX));
            container.scrollTop -= (-pos.y + (pos.y = e.clientY));
        }

        var pos = {
            x: 0,
            y: 0
        };

        if (container.clientWidth < container.scrollWidth || container.clientHeight < container.scrollHeight) {
            container.addEventListener('mousedown', mouseDown, 0);
            window.addEventListener('mouseup', mouseUp, false);
            container.oncontextmenu = function (e) {
                e.preventDefault();
            };
        }

    }

    if (/^(application\/x-javascript|application\/javascript|application\/json|text\/css)$/.test(contenttype) || /.+\.(js|json|css)$/.test(url)) {

        var output = doc.getElementsByTagName('pre')[0],
            txt = output.textContent,
            lang = 'javascript',
            lines = 0,
            l = '';

        GM_addStyle(GM_getResourceText(theme) + 'html,body,pre{margin:0;padding:0}.hljs{overflow:hidden;word-wrap:normal!important;white-space:pre!important;padding-left:4em;line-height:120%}.hljs::before{content:attr(data-lines);position:absolute;color:#d2d2d2;text-align:right;width:3.5em;left:-.5em;border-right:1px solid rgba(221, 221, 221, 0.36);padding-right:.5em}');

        if (contenttype === 'text/css' || /.+\.css$/.test(url)) {
            lang = 'css';
            txt = css_beautify(txt);
        } else {
            txt = js_beautify(txt);
        }

        output.textContent = txt;
        output.setAttribute('class', lang);

        hljs.highlightBlock(output);

        lines = txt.split('\n');
        lines = lines ? lines.length : 0;
        for (var i = 0; i < lines; i++) {
            l += (i + 1) + '\n';
        }

        output.setAttribute('data-lines', l);
        output.style.width = output.scrollWidth + 'px';

        scrollByDragging(doc.body);

    }

}());
