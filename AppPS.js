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
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from 'react';
import { GameCanvas } from './GameCanvas.js';
import { UIProvider } from './UIContext.js';
import { BubblePerformanceUI } from './BubblePerformanceUI.js';
import { ReefInfoOverlay } from './ReefInfoOverlay.js';
import { UIOverlay } from './UIOverlay.js';
// import { AppErrorBoundary } from './AppErrorBoundary.js'; // Remove Error Boundary import
import { Html } from '@react-three/drei';
export function AppPS() {
    var _useState = _sliced_to_array(useState(false), 2), showPhysicsDemo = _useState[0], setShowPhysicsDemo = _useState[1];
    var _useState1 = _sliced_to_array(useState(true), 2), physicsEnabled = _useState1[0], setPhysicsEnabled = _useState1[1];
    var _useState2 = _sliced_to_array(useState(null), 2), bubblePool = _useState2[0], setBubblePool = _useState2[1];
    // Function to handle bubble pool from GameCanvas
    var handleBubblePoolReady = function(pool) {
        setBubblePool(pool);
    };
    return(// <AppErrorBoundary> {/* Remove Error Boundary wrapper */}
    /*#__PURE__*/ _jsxDEV(UIProvider, {
        children: /*#__PURE__*/ _jsxDEV("div", {
            style: {
                position: 'relative',
                width: '100%',
                height: '100%'
            },
            children: [
                /*#__PURE__*/ _jsxDEV(GameCanvas, {
                    showPhysicsDemo: showPhysicsDemo,
                    physicsEnabled: physicsEnabled,
                    onBubblePoolReady: handleBubblePoolReady,
                    children: /*#__PURE__*/ _jsxDEV(Html, {
                        fullscreen: true,
                        children: [
                            /*#__PURE__*/ _jsxDEV(UIOverlay, {}, void 0, false, {
                                fileName: "AppPS.js",
                                lineNumber: 30,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ _jsxDEV(ReefInfoOverlay, {}, void 0, false, {
                                fileName: "AppPS.js",
                                lineNumber: 31,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "AppPS.js",
                        lineNumber: 29,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "AppPS.js",
                    lineNumber: 23,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ _jsxDEV(BubblePerformanceUI, {
                    bubblePool: bubblePool
                }, void 0, false, {
                    fileName: "AppPS.js",
                    lineNumber: 36,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "AppPS.js",
            lineNumber: 22,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "AppPS.js",
        lineNumber: 21,
        columnNumber: 7
    }, this));
}
export default AppPS;
