function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var _this = this;
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React from 'react';
import { GameScene } from './GameScene.js';
import { BubblePerformanceUI } from './BubblePerformanceUI.js';
export var GameSceneWithPerformanceMonitor = function(param) {
    var onEmitterReady = param.onEmitterReady, onBubblePoolReady = param.onBubblePoolReady, causticsIntensity = param.causticsIntensity;
    // Create a ref to hold the bubble pool
    var _React_useState = _sliced_to_array(React.useState(null), 2), bubblePool = _React_useState[0], setBubblePool = _React_useState[1];
    // Handle the bubble pool being ready
    var handleBubblePoolReady = function(pool) {
        setBubblePool(pool);
        if (typeof onBubblePoolReady === 'function') {
            onBubblePoolReady(pool);
        }
    };
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV(GameScene, {
                onEmitterReady: onEmitterReady,
                onBubblePoolReady: handleBubblePoolReady,
                causticsIntensity: causticsIntensity
            }, void 0, false, {
                fileName: "GameSceneWithPerformanceMonitor.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(BubblePerformanceUI, {
                bubblePool: bubblePool
            }, void 0, false, {
                fileName: "GameSceneWithPerformanceMonitor.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true);
};
