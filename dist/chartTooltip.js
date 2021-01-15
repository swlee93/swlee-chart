"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelValueText = exports.getTitleValueText = exports.getStrongText = exports.getSubTitleText = exports.getTitleText = exports.getNomalGrayText = exports.getNomalText = void 0;
var Tooltip = /** @class */ (function () {
    function Tooltip() {
        var _this = this;
        this.setDefaultStyle = function () {
            _this.tooltipEl.style.font = "Roboto, Helvetica, Arial, '맑은 고딕', 'Malgun Gothic', '애플 SD 산돌고딕 Neo', 'Apple SD Gothic Neo', sans-serif";
            _this.tooltipEl.style.pointerEvents = "none";
            _this.tooltipEl.style.position = "absolute";
            _this.tooltipEl.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
            _this.tooltipEl.style.color = "#222222";
            _this.tooltipEl.style.boxShadow = "0 2px 2px 0 rgba(0; 0; 0; 0.2)";
            _this.tooltipEl.style.border = "solid 1px #cccccc";
            _this.tooltipEl.style.borderRadius = "4px";
            _this.tooltipEl.style.padding = "8px";
            _this.tooltipEl.style.zIndex = "9999";
            _this.tooltipEl.style.top = "0px";
            _this.tooltipEl.style.left = "0px";
            _this.tooltipEl.style.fontSize = "11px";
            _this.tooltipEl.style.minWidth = "108px";
            _this.tooltipEl.style.boxSizing = "border-box";
            _this.tooltipEl.style.whiteSpace = "nowrap";
        };
        this.tooltipOn = function () {
            _this.tooltipStat = true;
            document.body.appendChild(_this.tooltipEl);
        };
        this.tooltipOff = function () {
            _this.tooltipStat = false;
            if (document.body.contains(_this.tooltipEl)) {
                document.body.removeChild(_this.tooltipEl);
            }
        };
        this.follow = function (evt) {
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var width = _this.tooltipEl.offsetWidth;
            var height = _this.tooltipEl.offsetHeight;
            var winWidth = document.body.clientWidth;
            var winHeight = window.innerHeight;
            if (evt.clientX + 8 + width > winWidth) {
                var rightPos = winWidth - evt.clientX - scrollX + 8;
                _this.tooltipEl.style.left = "auto";
                _this.tooltipEl.style.right = rightPos + "px";
            }
            else {
                var leftPos = evt.clientX + 8 + scrollX;
                _this.tooltipEl.style.right = "auto";
                _this.tooltipEl.style.left = leftPos + "px";
            }
            if (evt.clientY + 8 + height > winHeight) {
                var bottomPos = winHeight - evt.clientY - scrollY + 8;
                _this.tooltipEl.style.top = "auto";
                _this.tooltipEl.style.bottom = bottomPos + "px";
            }
            else {
                var topPos = evt.clientY + 8 + scrollY;
                _this.tooltipEl.style.bottom = "auto";
                _this.tooltipEl.style.top = topPos + "px";
            }
        };
        this.changeText = function (dom) {
            _this.tooltipEl.innerHTML = "";
            _this.tooltipEl.appendChild(dom);
        };
        this.tooltipEl = document.createElement('div');
        this.tooltipEl.className = "whatap-tooltip";
        this.tooltipStat = false;
        this.setDefaultStyle();
    }
    return Tooltip;
}());
exports.default = Tooltip;
// 여기부터 툴팁 텍스트
var getNomalText = function (text) {
    var dom = document.createElement('div');
    var style = dom.style;
    dom.innerText = text;
    style.marginBottom = "6px";
    return dom;
};
exports.getNomalText = getNomalText;
var getNomalGrayText = function (text) {
    var dom = document.createElement('div');
    var style = dom.style;
    dom.innerText = text;
    style.color = "#999999";
    style.marginBottom = "4px";
    return dom;
};
exports.getNomalGrayText = getNomalGrayText;
var getTitleText = function (text) {
    var dom = document.createElement('div');
    var style = dom.style;
    dom.innerText = text;
    style.fontSize = "12px";
    style.fontWeight = "500";
    style.marginBottom = "4px";
    return dom;
};
exports.getTitleText = getTitleText;
var getSubTitleText = function (text) {
    var dom = document.createElement('div');
    var style = dom.style;
    dom.innerText = text;
    style.fontSize = "12px";
    style.lineHeight = "14px";
    style.color = "#666666";
    return dom;
};
exports.getSubTitleText = getSubTitleText;
var getStrongText = function (text) {
    var dom = document.createElement('div');
    var style = dom.style;
    dom.innerText = text;
    style.fontSize = "20px";
    style.fontWeight = "bold";
    return dom;
};
exports.getStrongText = getStrongText;
var getTitleValueText = function (title, value, valueColor) {
    var dom = document.createElement('div');
    var valueDom = document.createElement('span');
    var style = dom.style;
    style.fontSize = "12px";
    valueDom.innerText = value;
    if (valueColor) {
        valueDom.style.color = valueColor;
    }
    valueDom.style.fontWeight = "bold";
    valueDom.style.marginLeft = "3px";
    dom.appendChild(document.createTextNode(title));
    dom.appendChild(valueDom);
    return dom;
};
exports.getTitleValueText = getTitleValueText;
var getLabelValueText = function (label, value, color) {
    var dom = document.createElement('div');
    dom.style.marginBottom = "2px";
    var dotDom = document.createElement('div');
    dotDom.style.width = "8px";
    dotDom.style.height = "8px";
    dotDom.style.borderRadius = "4px";
    dotDom.style.margin = "2px 4px 3px 0px";
    dotDom.style.background = color;
    dotDom.style.display = "inline-block";
    dotDom.style.verticalAlign = "top";
    dom.appendChild(dotDom);
    var labelDom = document.createElement('span');
    labelDom.innerText = label;
    labelDom.style.marginRight = "4px";
    labelDom.style.verticalAlign = "top";
    dom.appendChild(labelDom);
    var valueDom = document.createElement('span');
    valueDom.innerText = ": " + value;
    valueDom.style.verticalAlign = "top";
    dom.appendChild(valueDom);
    return dom;
};
exports.getLabelValueText = getLabelValueText;
