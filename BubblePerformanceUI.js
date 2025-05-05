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
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useState } from 'react';
import { useUI } from './UIContext.js';
export var BubblePerformanceUI = function(param) {
    var bubblePool = param.bubblePool;
    var showPerformanceStats = useUI().showPerformanceStats;
    var _useState = _sliced_to_array(useState({
        activeBubbles: 0,
        totalBubbles: 0,
        spawnsPerSecond: 0,
        frameTime: 0,
        memoryUsage: 0
    }), 2), stats = _useState[0], setStats = _useState[1];
    useEffect(function() {
        if (!showPerformanceStats || !bubblePool) return;
        // Update stats at regular intervals
        var updateStats = function() {
            if (!bubblePool) return;
            // Safely access bubble pool methods with try/catch to prevent errors
            var activeBubbles = 0;
            var totalBubbles = 0;
            var spawnsPerSecond = 0;
            var frameTime = 0;
            try {
                if (typeof bubblePool.getActiveCount === 'function') {
                    activeBubbles = bubblePool.getActiveCount();
                }
                if (typeof bubblePool.getPoolSize === 'function') {
                    totalBubbles = bubblePool.getPoolSize();
                }
                if (typeof bubblePool.getSpawnRate === 'function') {
                    spawnsPerSecond = bubblePool.getSpawnRate();
                }
                if (typeof bubblePool.getLastFrameTime === 'function') {
                    frameTime = bubblePool.getLastFrameTime();
                }
            } catch (error) {
                console.warn("Error accessing bubble pool methods:", error);
            }
            // Get current stats from bubble pool
            var currentStats = {
                activeBubbles: activeBubbles,
                totalBubbles: totalBubbles,
                spawnsPerSecond: spawnsPerSecond,
                frameTime: frameTime,
                memoryUsage: typeof performance !== 'undefined' && typeof performance.memory !== 'undefined' && performance.memory && performance.memory.usedJSHeapSize ? performance.memory.usedJSHeapSize / 1048576 : 0 // MB
            };
            setStats(currentStats);
        };
        var intervalId = setInterval(updateStats, 500);
        // Initial update
        updateStats();
        return function() {
            return clearInterval(intervalId);
        };
    }, [
        showPerformanceStats,
        bubblePool
    ]);
    if (!showPerformanceStats || !bubblePool) return null;
    return /*#__PURE__*/ _jsxDEV("div", {
        style: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0,15,30,0.75)',
            color: '#00FF88',
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '12px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            backdropFilter: 'blur(2px)',
            userSelect: 'none',
            pointerEvents: 'none',
            maxWidth: '300px'
        },
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    fontWeight: 'bold',
                    marginBottom: '6px',
                    fontSize: '14px',
                    color: '#44FFAA'
                },
                children: "Bubble Performance Monitor"
            }, void 0, false, {
                fileName: "BubblePerformanceUI.jsx",
                lineNumber: 88,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("table", {
                style: {
                    borderCollapse: 'collapse',
                    width: '100%'
                },
                children: /*#__PURE__*/ _jsxDEV("tbody", {
                    children: [
                        /*#__PURE__*/ _jsxDEV("tr", {
                            children: [
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        paddingRight: '12px',
                                        color: '#88DDFF'
                                    },
                                    children: "Active Bubbles:"
                                }, void 0, false, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        textAlign: 'right'
                                    },
                                    children: stats.activeBubbles
                                }, void 0, false, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "BubblePerformanceUI.jsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ _jsxDEV("tr", {
                            children: [
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        paddingRight: '12px',
                                        color: '#88DDFF'
                                    },
                                    children: "Total Pool Size:"
                                }, void 0, false, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        textAlign: 'right'
                                    },
                                    children: stats.totalBubbles
                                }, void 0, false, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "BubblePerformanceUI.jsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ _jsxDEV("tr", {
                            children: [
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        paddingRight: '12px',
                                        color: '#88DDFF'
                                    },
                                    children: "Spawns/Second:"
                                }, void 0, false, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        textAlign: 'right'
                                    },
                                    children: stats.spawnsPerSecond.toFixed(2)
                                }, void 0, false, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "BubblePerformanceUI.jsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ _jsxDEV("tr", {
                            children: [
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        paddingRight: '12px',
                                        color: '#88DDFF'
                                    },
                                    children: "Frame Time:"
                                }, void 0, false, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        textAlign: 'right'
                                    },
                                    children: [
                                        stats.frameTime.toFixed(2),
                                        " ms"
                                    ]
                                }, void 0, true, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "BubblePerformanceUI.jsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, _this),
                        stats.memoryUsage > 0 && /*#__PURE__*/ _jsxDEV("tr", {
                            children: [
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        paddingRight: '12px',
                                        color: '#88DDFF'
                                    },
                                    children: "Memory Usage:"
                                }, void 0, false, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 111,
                                    columnNumber: 15
                                }, _this),
                                /*#__PURE__*/ _jsxDEV("td", {
                                    style: {
                                        textAlign: 'right'
                                    },
                                    children: [
                                        stats.memoryUsage.toFixed(2),
                                        " MB"
                                    ]
                                }, void 0, true, {
                                    fileName: "BubblePerformanceUI.jsx",
                                    lineNumber: 112,
                                    columnNumber: 15
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "BubblePerformanceUI.jsx",
                            lineNumber: 110,
                            columnNumber: 13
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "BubblePerformanceUI.jsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "BubblePerformanceUI.jsx",
                lineNumber: 91,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    height: '4px',
                    marginTop: '8px',
                    background: 'linear-gradient(90deg, #00FF88, #0088FF)',
                    borderRadius: '2px',
                    width: "".concat(Math.min(100, stats.activeBubbles / stats.totalBubbles * 100), "%"),
                    transition: 'width 0.3s ease-out'
                }
            }, void 0, false, {
                fileName: "BubblePerformanceUI.jsx",
                lineNumber: 117,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "BubblePerformanceUI.jsx",
        lineNumber: 71,
        columnNumber: 5
    }, _this);
};
