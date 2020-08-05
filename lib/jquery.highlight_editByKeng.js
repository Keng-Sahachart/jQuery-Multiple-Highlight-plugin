/*  edit  by keng 
multi word ,multi color highlight
complete 13 may 2013

*ต้องใช้ jquery ก่อน แล้วจึงจะสามารถใช้ 
*ใช้ในเหตุการณ์ onkeyup จะได้ผลดีกว่า ตอน ล้าง ไฮไลต์
use funtion :
highlightwords(target, words); สร้าง cssStyle พร้อมกับ , สร้าง Tag กำหนด CSS ให้ word
unhighlightwords(target);ลบ cssStyle ,ลบ Tag กำหนด CSS ให้ word

and you can edit color number in variable : colorsName

สำหรับครั้งต่อไป เพิ่ม
***
*/

/*
* jQuery Highlight plugin
*
* Based on highlight v3 by Johann Burkard
* http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
*
* Code a little bit refactored and cleaned (in my humble opinion).
* Most important changes:
*  - has an option to highlight only entire words (wordsOnly - false by default),
*  - has an option to be case sensitive (caseSensitive - false by default)
*  - highlight element tag and class names can be specified in options
*
* Usage:
*   // wrap every occurrance of text 'lorem' in content
*   // with <span class='highlight'> (default options)
*   $('#content').highlight('lorem');
*
*   // search for and highlight more terms at once
*   // so you can save some time on traversing DOM
*   $('#content').highlight(['lorem', 'ipsum']);
*   $('#content').highlight('lorem ipsum');
*
*   // search only for entire word 'lorem'
*   $('#content').highlight('lorem', { wordsOnly: true });
*
*   // don't ignore case during search of term 'lorem'
*   $('#content').highlight('lorem', { caseSensitive: true });
*
*   // wrap every occurrance of term 'ipsum' in content
*   // with <em class='important'>
*   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
*
*   // remove default highlight
*   $('#content').unhighlight();
*
*   // remove custom highlight
*   $('#content').unhighlight({ element: 'em', className: 'important' });
*
*
* Copyright (c) 2009 Bartek Szopka
*
* Licensed under MIT license.
*
*/

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function (word, i) {
        return word != '';
    });
    words = jQuery.map(words, function (word, i) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};
////////////////////////////////////////////////////////
///     edit by keng   ////////////////////////////////
////////////////////////////////////////////////////////

//กำหนดสีทั้งหมด ที่ต้องใช้ แก้ไขตรงนี้ได้
var colorsName = ['Orange', 'Chartreuse', 'Gold', 'PeachPuff', 'GreenYellow', 'Cyan', 'AquaMarine', 'DarkTurquoise', 'Moccasin', 'BlueViolet', 'LightPink', 'Coral', 'Plum', 'LightGreen', 'DarkSalmon', 'Khaki', 'SandyBrown', 'Bisque', 'PowderBlue', 'Peru'];

var cssStyleHighlight = $("<style type='text/css'> </style>").appendTo("head"); // css ที่ใช้ บรรจุ style 
var allHighlight = 0; // เก็บจำนวนที่ highlight ไว้ เพื่อทำการ unhighlight ทีหลัง
function highlightwords(target, words) {
    unhighlightwords(target); //ป้องกัน สร้าง style ซ้ำ
    var numColor = colorsName.length;
    var word_ary = words.split(" ");
    allHighlight = word_ary.length;
    for (var i = 0; i < word_ary.length; i++) {
        cssStyleHighlight.append(".cssHighlightStyle" + i + "{ background-color: " + colorsName[(i % numColor)] + " ;}");
        $(target).highlight(word_ary[i], { className: 'cssHighlightStyle' + i });
    }
    //alert('allHighlight is ' + allHighlight);
}

function unhighlightwords(target) {
    //alert('allHighlight is ' + allHighlight);
    cssStyleHighlight.empty(); // เคลียร์ ลบ style ทั้งหมด
    for (var i = allHighlight; i >= 0; i--) {  // *แก้ปัญหา สำหรับ คำค้นที่ ซ้อนกัน โดยการ ลบ hili หลังไปหน้า เป็นการ ลบย้อนกลับ
   // for (var i = 0; i < allHighlight ; i++) { //*มีปัญหา กับ คำค้น ที่มีคำซ้อนกัน เช่น 01 0 พอลบ 0 แล้ว 01 จะกลายเป็น 1 เพราะ ลบ hili หน้าไปหลัง
        $(target).unhighlight({ className: 'cssHighlightStyle' + i });
    }
    allHighlight = 0;
}
