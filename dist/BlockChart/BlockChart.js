"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chartUtils_1 = require("../chartUtils");
var chartTooltip_1 = __importStar(require("../chartTooltip")), TD = chartTooltip_1;
var theme_1 = __importDefault(require("../theme"));
var INACTIVE_OUT = 3;
var getTooltip = function (block, format) {
    var data = block.data, lastData = block.lastData, status = block.status;
    var dom = document.createElement('div');
    var drawBody = function (data) {
        if (format) {
            var formatData = format(data);
            if (typeof formatData === 'object') {
                dom.appendChild(formatData);
            }
            else {
                var div = document.createElement('div');
                div.innerHTML = format(data);
                dom.appendChild(div);
            }
        }
        else {
            dom.appendChild(TD.getStrongText("" + data.value));
        }
    };
    if (lastData) {
        dom.appendChild(TD.getTitleText(lastData.label));
        if (status !== 'unknown') {
            drawBody(lastData);
        }
    }
    else {
        dom.appendChild(TD.getTitleText(data.label));
        drawBody(data);
    }
    return dom;
};
/**
 * 육각형 객체 하나
 */
var Block = /** @class */ (function () {
    function Block(parent, data, x, y, w, h) {
        var _this = this;
        this.status = 'normal';
        this.pos = [0, 0, 0, 0];
        this.inactiveOut = 0;
        this.updateData = function (data) {
            if (data) {
                _this.lastData = undefined;
                var valueChange = data.value !== _this.value;
                if (_this.status === 'unknown') {
                    _this.value = data.value;
                    if (_this.parent.thresholds) {
                        _this.status = _this.parent.thresholds(data.value, data) || 'normal';
                    }
                    else {
                        _this.status = 'normal';
                    }
                }
                else if (valueChange) {
                    _this.value = data.value;
                    var prevStatus = _this.status;
                    var nextStatus = _this.status;
                    if (_this.parent.thresholds) {
                        nextStatus = _this.parent.thresholds(data.value, data) || 'normal';
                    }
                    if (prevStatus !== nextStatus) {
                        _this.prevStatus = prevStatus;
                        _this.status = nextStatus;
                    }
                }
            }
            else if (!_this.lastData) {
                _this.lastData = _this.data;
                _this.inactiveOut = 1;
            }
            else {
                if (_this.status !== 'unknown') {
                    _this.inactiveOut++;
                    if (_this.inactiveOut >= INACTIVE_OUT) {
                        _this.status = 'unknown';
                    }
                }
            }
            _this.data = data;
        };
        this.resizeBlock = function (x, y, w, h) {
            _this.pos = [x, y, w, h];
        };
        this.render = function () {
            var _a;
            var ctx = _this.parent.ctx;
            var _b = _this.pos, x = _b[0], y = _b[1], w = _b[2], h = _b[3];
            var valueVisible = typeof _this.parent.valueVisible !== 'undefined' ? _this.parent.valueVisible : true;
            var hasValue = typeof ((_a = _this.data) === null || _a === void 0 ? void 0 : _a.value) !== 'undefined';
            var isHover = _this.parent.hovering === _this;
            var getStatusColor = _this.parent.getStatusColor;
            if (_this.status === 'unknown')
                return;
            ctx.save();
            ctx.beginPath();
            if (isHover)
                ctx.globalAlpha = 1;
            ctx.fillStyle = getStatusColor(_this.status, _this.value / _this.parent.maxValue);
            ctx.rect(x + 1, y + 1, w - 1, h - 1);
            ctx.fill();
            if (hasValue && valueVisible && w > 30 && h > 20) {
                // 라벨링
                var fontSizeBase = w / 10;
                if (fontSizeBase < 9) {
                    fontSizeBase = 9;
                }
                else if (fontSizeBase > 15) {
                    fontSizeBase = 15;
                }
                ctx.font = fontSizeBase + "px Roboto";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#FFFFFF';
                var value = _this.parent.valueFormat ? _this.parent.valueFormat(_this.data.value) : _this.data.value;
                var label = _this.data.label || '';
                var fitLabel = _this.fittingString(ctx, label, w * 0.9);
                var centerX = x + w / 2;
                var pad = fontSizeBase / 2;
                var isEnoughHeight = fontSizeBase * 2 + pad * 5 < h;
                if (fitLabel && isEnoughHeight) {
                    // label과 value를 표시
                    ctx.fillText(fitLabel, centerX, y + h * 0.33 - pad);
                    ctx.font = fontSizeBase + pad + "px Roboto";
                    ctx.fillText(value, centerX, y + h * 0.66);
                }
                else if (fitLabel) {
                    // label만 그릴 수 있는 높이
                    ctx.fillText(fitLabel, centerX, y + h / 2);
                }
                else if (fontSizeBase < h) {
                    // value만 그릴 수 있음
                    ctx.fillText(value, centerX, y + h / 2);
                }
                // const width = ctx.measureText(value).width
            }
            ctx.closePath();
            ctx.restore();
        };
        this.parent = parent;
        this.resizeBlock(x, y, w, h);
        this.data = data;
        this.value = data.value;
        if (parent.thresholds) {
            this.status = parent.thresholds(data.value, data) || 'normal';
        }
    }
    Block.prototype.fittingString = function (ctx, str, maxWidth) {
        if (!str || !Number(maxWidth))
            return '';
        var width = ctx.measureText(str).width;
        var ellipsis = '…';
        var ellipsisWidth = ctx.measureText(ellipsis).width;
        if (width <= maxWidth || width <= ellipsisWidth) {
            return str;
        }
        else {
            var len = str.length;
            while (width >= maxWidth - ellipsisWidth && len-- > 0) {
                str = str.substring(0, len);
                width = ctx.measureText(str).width;
            }
            return str + ellipsis;
        }
    };
    return Block;
}());
var BlockChart = /** @class */ (function () {
    function BlockChart(canvas, option) {
        var _this = this;
        this.width = 0;
        this.height = 0;
        this.themeAttrs = theme_1.default;
        this.x = 0;
        this.y = 0;
        this.dataIds = [];
        this.blocks = {};
        this.datas = [];
        this.maxValue = 0;
        this.fixedMaxValue = 0;
        this.jsonDatas = {};
        this.prevDataIds = [];
        this.mouseHoverCallback = undefined;
        this.draw = function () {
            var ctx = _this.ctx;
            ctx.clearRect(0, 0, _this.width, _this.height);
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (_this.hovering)
                _this.ctx.globalAlpha = 0.4;
            _this.dataIds.forEach(function (id) {
                var block = _this.blocks[id];
                block.render();
            });
            if (_this.hovering)
                _this.ctx.globalAlpha = 1;
            ctx.restore();
        };
        // clear 는 데이터 비워진 부분을 지울지 여부 기본으로 데이터 비워진 부분은 지우지 않고 빈칸으로 남겨둔다
        this.loadData = function (datas, clear) {
            if (clear === void 0) { clear = false; }
            _this.datas = datas;
            _this.jsonDatas = {};
            _this.prevDataIds = __spreadArrays(_this.dataIds);
            var maxValue = 0;
            _this.dataIds = _this.datas.reduce(function (acc, d) {
                if (d.id) {
                    acc.push(d.id);
                }
                return acc;
            }, []);
            _this.datas.forEach(function (d, idx) {
                if (typeof d.id === 'undefined')
                    return;
                _this.jsonDatas[d.id] = d;
                // 업데이트 데이터를 더하는 방식
                // if (this.dataIds.indexOf(d.id) === -1) {
                //   this.dataIds.push(d.id)
                // }
                if (maxValue < d.value) {
                    maxValue = d.value;
                }
            });
            _this.maxValue = _this.fixedMaxValue || maxValue;
            _this.setAttribute();
            _this.draw();
            if (_this.tooltip.tooltipStat && _this.hovering) {
                _this.tooltip.changeText(getTooltip(_this.hovering, _this.format));
            }
        };
        this.makeBlock = function (resize) {
            var _a = _this, x = _a.x, y = _a.y, w = _a.w, h = _a.h, cols = _a.cols, hasSort = _a.hasSort;
            var thisX = x;
            var thisY = y;
            var thisW = w;
            var thisH = h;
            var setRect = function (index) {
                var xPos = index % cols;
                var yPos = Math.floor(index / cols);
                thisX = thisW * xPos;
                thisY = thisH * yPos;
            };
            if (!resize) {
                _this.dataIds.forEach(function (id, index) {
                    setRect(index);
                    if (hasSort) {
                        _this.blocks[id] = new Block(_this, _this.jsonDatas[id], thisX, thisY, thisW, thisH);
                    }
                    else {
                        var block = _this.blocks[id];
                        if (!block) {
                            block = _this.blocks[id] = new Block(_this, _this.jsonDatas[id], thisX, thisY, thisW, thisH);
                        }
                        else {
                            //데이터만 업데이트
                            var data = _this.jsonDatas[id];
                            block.updateData(data);
                        }
                    }
                });
            }
            else {
                // 사이즈 조정에 의해 새로 그림
                _this.dataIds.forEach(function (id, index) {
                    setRect(index);
                    _this.blocks[id].resizeBlock(thisX, thisY, thisW, thisH);
                });
            }
        };
        this.cols = 0;
        this.rows = 0;
        this.w = 0;
        this.h = 0;
        this.setBlockBase = function (resize) {
            if (resize === void 0) { resize = false; }
            var count = _this.dataIds.length;
            var prevCount = _this.prevDataIds.length;
            var arrChange = count !== prevCount;
            if (arrChange || resize) {
                // 화면 비율에 따라 행렬 수를 결정함
                var ratio = _this.width / _this.height;
                _this.cols = Math.floor(Math.sqrt(ratio * count));
                _this.rows = Math.ceil(count / _this.cols);
                _this.w = _this.width / _this.cols;
                _this.h = _this.height / _this.rows;
            }
            _this.makeBlock(resize);
        };
        this.setAttribute = function (resize) {
            if (resize === void 0) { resize = false; }
            _this.setBlockBase(resize);
        };
        this.getStatusColor = function (status, alpha) {
            if (status === void 0) { status = undefined; }
            if (alpha === void 0) { alpha = 1; }
            var _a = _this, themeAttrs = _a.themeAttrs, colorMeta = _a.colorMeta;
            var color = (colorMeta === null || colorMeta === void 0 ? void 0 : colorMeta.normal) || themeAttrs.normal_1;
            switch (status) {
                case 'inactive':
                    color = (colorMeta === null || colorMeta === void 0 ? void 0 : colorMeta.inactive) || themeAttrs.disabled_color;
                    break;
                case 'error':
                    color = (colorMeta === null || colorMeta === void 0 ? void 0 : colorMeta.error) || themeAttrs.bg_critical_color;
                    break;
                case 'warning':
                    color = (colorMeta === null || colorMeta === void 0 ? void 0 : colorMeta.warning) || themeAttrs.bg_warning_color;
                    break;
                default:
            }
            return alpha < 1 ? chartUtils_1.hex2rgba(color, alpha) : color;
        };
        /**
         * Events
         */
        this.resizeEvent = function () {
            _this.width = _this.canvas.clientWidth;
            _this.height = _this.canvas.clientHeight;
            _this.x = 0;
            _this.y = 0;
            _this.ctx = chartUtils_1.setCanvasDPI(_this.canvas);
            _this.ctx.fillStyle = '#bdbdbd';
            _this.setAttribute(true);
            _this.draw();
        };
        this.mouseClickEvent = function (e) {
            if (typeof _this.onClick === 'function') {
                var len = _this.dataIds.length;
                for (var i = 0; i < len; i++) {
                    var block = _this.blocks[_this.dataIds[i]];
                    if (chartUtils_1.inMouseOnRect(block.pos, e)) {
                        _this.onClick(block.data.value, block.data);
                        break;
                    }
                }
            }
        };
        this.mouseHoverEvent = function (e) {
            if (!_this.mouseHoverThrottlingTimmer) {
                _this.mouseHoverDebounceEvent = e;
                _this.mouseHoverThrottlingTimmer = setTimeout(function () {
                    if (_this.mouseHoverDebounceEvent) {
                        _this.mouseHoverEventFunc(_this.mouseHoverDebounceEvent);
                        if (_this.mouseHoverCallback) {
                            _this.mouseHoverCallback(_this.hovering);
                        }
                    }
                    _this.mouseHoverThrottlingTimmer = null;
                }, 60);
            }
            else {
                _this.mouseHoverDebounceEvent = e;
            }
        };
        this.mouseHoverEventFunc = function (e) {
            var nexthovering;
            var tooltip = _this.tooltip;
            _this.dataIds.some(function (id) {
                var block = _this.blocks[id];
                if (chartUtils_1.inMouseOnRect(block.pos, e)) {
                    nexthovering = block;
                    return true;
                }
            });
            if (_this.hovering !== nexthovering) {
                if (nexthovering) {
                    _this.tooltip.changeText(getTooltip(nexthovering, _this.format));
                    _this.tooltip.follow(e);
                    if (!tooltip.tooltipStat)
                        _this.tooltip.tooltipOn();
                }
                else if (tooltip.tooltipStat) {
                    tooltip.tooltipOff();
                }
                _this.hovering = nexthovering;
                requestAnimationFrame(_this.draw);
            }
            else if (_this.hovering) {
                tooltip.follow(e);
            }
        };
        this.mouseLeaveEvent = function () {
            if (_this.mouseHoverThrottlingTimmer) {
                clearTimeout(_this.mouseHoverThrottlingTimmer);
                _this.mouseHoverThrottlingTimmer = null;
            }
            if (_this.hovering) {
                _this.hovering = undefined;
                _this.draw();
            }
            if (_this.mouseHoverCallback) {
                _this.mouseHoverCallback(undefined);
            }
            if (_this.tooltip.tooltipStat) {
                _this.tooltip.tooltipOff();
            }
        };
        this.canvas = canvas;
        this.resizeEvent();
        canvas.addEventListener('click', this.mouseClickEvent);
        canvas.addEventListener('mousemove', this.mouseHoverEvent);
        canvas.addEventListener('mouseleave', this.mouseLeaveEvent);
        this.tooltip = new chartTooltip_1.default();
        this.fixedMaxValue = (option === null || option === void 0 ? void 0 : option.fixedMaxValue) || 0;
        this.mouseHoverCallback = option === null || option === void 0 ? void 0 : option.mouseHoverCallback;
    }
    return BlockChart;
}());
exports.default = BlockChart;
