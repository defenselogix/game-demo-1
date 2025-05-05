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
import React, { useState, useEffect } from 'react';
import { AppErrorBoundary } from './AppErrorBoundary.js';
export function LoadingScreen(param) {
    var onLoadComplete = param.onLoadComplete;
    var _useState = _sliced_to_array(useState(0), 2), progress = _useState[0], setProgress = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), isComplete = _useState1[0], setIsComplete = _useState1[1];
    useEffect(function() {
        // Simulate loading progress
        var interval = setInterval(function() {
            setProgress(function(prev) {
                var newProgress = Math.min(prev + Math.random() * 15, 100);
                if (newProgress >= 100) {
                    clearInterval(interval);
                    // Add a small delay before completing to ensure animations finish
                    setTimeout(function() {
                        setIsComplete(true);
                        if (onLoadComplete) onLoadComplete();
                    }, 500);
                }
                return newProgress;
            });
        }, 200);
        return function() {
            return clearInterval(interval);
        };
    }, [
        onLoadComplete
    ]);
    return /*#__PURE__*/ _jsxDEV(AppErrorBoundary, {
        children: /*#__PURE__*/ _jsxDEV("div", {
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom, #0a3d62, #1e3c72)',
                color: 'white',
                fontFamily: 'Arial, sans-serif',
                opacity: isComplete ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out',
                zIndex: 1000,
                pointerEvents: isComplete ? 'none' : 'auto'
            },
            children: [
                /*#__PURE__*/ _jsxDEV("h1", {
                    style: {
                        fontSize: '32px',
                        marginBottom: '30px',
                        textShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    },
                    children: "Aquarium Experience"
                }, void 0, false, {
                    fileName: "LoadingScreen.jsx",
                    lineNumber: 50,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    style: {
                        width: '80%',
                        maxWidth: '400px',
                        height: '20px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    },
                    children: /*#__PURE__*/ _jsxDEV("div", {
                        style: {
                            height: '100%',
                            width: "".concat(progress, "%"),
                            background: 'linear-gradient(to right, #00a8ff, #0097e6)',
                            borderRadius: '10px',
                            transition: 'width 0.2s ease-out'
                        }
                    }, void 0, false, {
                        fileName: "LoadingScreen.jsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "LoadingScreen.jsx",
                    lineNumber: 58,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ _jsxDEV("p", {
                    style: {
                        marginTop: '15px',
                        fontSize: '16px',
                        opacity: '0.8'
                    },
                    children: [
                        Math.round(progress),
                        "% Loading..."
                    ]
                }, void 0, true, {
                    fileName: "LoadingScreen.jsx",
                    lineNumber: 76,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    style: {
                        position: 'absolute',
                        bottom: '20px',
                        fontSize: '14px',
                        opacity: '0.6'
                    },
                    children: "Preparing your underwater experience"
                }, void 0, false, {
                    fileName: "LoadingScreen.jsx",
                    lineNumber: 84,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "LoadingScreen.jsx",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "LoadingScreen.jsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
