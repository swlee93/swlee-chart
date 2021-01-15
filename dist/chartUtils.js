"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hex2rgba = exports.inMouseOnRect = exports.inMouse = exports.setCanvasDPI = void 0;
var setCanvasDPI = function (canvas, ctx) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    var dpi = window.devicePixelRatio || 1;
    if (dpi > 1) {
        canvas.width = width * dpi;
        canvas.height = height * dpi;
        var ctx_1 = canvas.getContext('2d');
        ctx_1.scale(dpi, dpi);
        return ctx_1;
    }
    else {
        canvas.width = width;
        canvas.height = height;
        var ctx_2 = canvas.getContext('2d');
        ctx_2.scale(1, 1);
        return ctx_2;
    }
};
exports.setCanvasDPI = setCanvasDPI;
// 다각형 안에 마우스가 들어있는지 확인.
var inMouse = function (positions, evt) {
    var cross = 0;
    var length = positions.length;
    for (var i = 0; i < length; i++) {
        var j = (i + 1) % length;
        var pos = positions[i];
        var pos2 = positions[j];
        if (pos[1] > evt.offsetY !== pos2[1] > evt.offsetY) {
            var vis = ((pos2[0] - pos[0]) * (evt.offsetY - pos[1])) / (pos2[1] - pos[1]) + pos[0];
            if (evt.offsetX < vis) {
                cross++;
            }
        }
    }
    return cross % 2 > 0;
};
exports.inMouse = inMouse;
var inMouseOnRect = function (rect, evt) {
    if (rect === void 0) { rect = [0, 0, 0, 0]; }
    var x = rect[0], y = rect[1], w = rect[2], h = rect[3];
    return x < evt.offsetX && x + w >= evt.offsetX && y < evt.offsetY && y + h >= evt.offsetY;
};
exports.inMouseOnRect = inMouseOnRect;
var hex2rgba = function (hex, alpha) {
    if (hex === void 0) { hex = ''; }
    if (alpha === void 0) { alpha = 1; }
    var hexMatch = hex.match(/\w\w/g);
    if (hexMatch) {
        var _a = hexMatch.map(function (x) { return parseInt(x, 16); }), r = _a[0], g = _a[1], b = _a[2];
        return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
    }
    else {
        return hex;
    }
};
exports.hex2rgba = hex2rgba;
