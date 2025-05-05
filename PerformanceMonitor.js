function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
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
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import ReactDOM from 'react-dom';
// Performance monitoring HUD to track FPS and bubble metrics
export function PerformanceMonitor(param) {
    var _param_enabled = param.enabled, enabled = _param_enabled === void 0 ? true : _param_enabled, _param_bubblePool = param.bubblePool, bubblePool = _param_bubblePool === void 0 ? null : _param_bubblePool, _param_position = param.position, position = _param_position === void 0 ? "top-right" : _param_position, _param_showDetailed = param.showDetailed, showDetailed = _param_showDetailed === void 0 ? false : _param_showDetailed;
    // Skip rendering if not enabled
    if (!enabled) return null;
    // State for FPS tracking
    var _useState = _sliced_to_array(useState(0), 2), fps = _useState[0], setFps = _useState[1];
    var _useState1 = _sliced_to_array(useState({
        total: 0,
        active: 0,
        visible: 0
    }), 2), bubbleStats = _useState1[0], setBubbleStats = _useState1[1];
    // References for timing and counting
    var frameCount = useRef(0);
    var lastSecond = useRef(Date.now());
    var frameTimeSum = useRef(0);
    var frameTimeSamples = useRef(0);
    var lastFrameTime = useRef(Date.now());
    // Shared style objects to reduce render calculations
    var styles = {
        container: _object_spread({
            position: 'absolute',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000,
            transition: 'opacity 0.3s ease',
            opacity: 0.7
        }, position === 'top-right' ? {
            top: '10px',
            right: '10px'
        } : position === 'top-left' ? {
            top: '10px',
            left: '10px'
        } : position === 'bottom-right' ? {
            bottom: '10px',
            right: '10px'
        } : {
            bottom: '10px',
            left: '10px'
        }),
        stat: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px'
        },
        label: {
            marginRight: '10px',
            color: '#aaa'
        },
        value: {
            fontWeight: 'bold'
        },
        good: {
            color: '#4caf50'
        },
        warning: {
            color: '#ff9800'
        },
        critical: {
            color: '#f44336'
        }
    };
    // Function to determine color based on FPS value
    var getFpsColor = function(fps) {
        if (fps >= 55) return styles.good;
        if (fps >= 30) return styles.warning;
        return styles.critical;
    };
    // Update FPS counter each frame
    useFrame(function() {
        // Skip if not enabled
        if (!enabled) return;
        frameCount.current++;
        var now = Date.now();
        var frameTime = now - lastFrameTime.current;
        lastFrameTime.current = now;
        // Accumulate frame time for average calculation
        frameTimeSum.current += frameTime;
        frameTimeSamples.current++;
        // Update FPS counter once per second
        if (now - lastSecond.current >= 1000) {
            // Calculate FPS from frame count
            setFps(frameCount.current);
            // Calculate average frame time
            var avgFrameTime = frameTimeSum.current / frameTimeSamples.current;
            // Reset counters
            frameCount.current = 0;
            lastSecond.current = now;
            frameTimeSum.current = 0;
            frameTimeSamples.current = 0;
            // Update bubble stats if bubblePool is provided
            if (bubblePool && bubblePool.bubbles) {
                // Count active and visible bubbles
                var activeCount = 0;
                var visibleCount = 0;
                bubblePool.bubbles.forEach(function(bubble) {
                    if (bubble.active) activeCount++;
                    if (bubble.visible) visibleCount++;
                });
                setBubbleStats({
                    total: bubblePool.bubbles.length,
                    active: activeCount,
                    visible: visibleCount
                });
            }
        }
    });
    // Create a portal to render the HTML overlay outside of the Three.js canvas
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: typeof document !== 'undefined' && /*#__PURE__*/ ReactDOM.createPortal(/*#__PURE__*/ _jsxDEV("div", {
            style: styles.container,
            children: [
                /*#__PURE__*/ _jsxDEV("div", {
                    style: styles.stat,
                    children: [
                        /*#__PURE__*/ _jsxDEV("span", {
                            style: styles.label,
                            children: "FPS:"
                        }, void 0, false, {
                            fileName: "PerformanceMonitor.jsx",
                            lineNumber: 143,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ _jsxDEV("span", {
                            style: _object_spread({}, styles.value, getFpsColor(fps)),
                            children: fps
                        }, void 0, false, {
                            fileName: "PerformanceMonitor.jsx",
                            lineNumber: 144,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "PerformanceMonitor.jsx",
                    lineNumber: 142,
                    columnNumber: 11
                }, this),
                bubblePool && /*#__PURE__*/ _jsxDEV(_Fragment, {
                    children: [
                        /*#__PURE__*/ _jsxDEV("div", {
                            style: styles.stat,
                            children: [
                                /*#__PURE__*/ _jsxDEV("span", {
                                    style: styles.label,
                                    children: "Active Bubbles:"
                                }, void 0, false, {
                                    fileName: "PerformanceMonitor.jsx",
                                    lineNumber: 150,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ _jsxDEV("span", {
                                    style: styles.value,
                                    children: [
                                        bubbleStats.active,
                                        "/",
                                        bubbleStats.total
                                    ]
                                }, void 0, true, {
                                    fileName: "PerformanceMonitor.jsx",
                                    lineNumber: 151,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "PerformanceMonitor.jsx",
                            lineNumber: 149,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ _jsxDEV("div", {
                            style: styles.stat,
                            children: [
                                /*#__PURE__*/ _jsxDEV("span", {
                                    style: styles.label,
                                    children: "Visible Bubbles:"
                                }, void 0, false, {
                                    fileName: "PerformanceMonitor.jsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ _jsxDEV("span", {
                                    style: styles.value,
                                    children: bubbleStats.visible
                                }, void 0, false, {
                                    fileName: "PerformanceMonitor.jsx",
                                    lineNumber: 155,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "PerformanceMonitor.jsx",
                            lineNumber: 153,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true),
                showDetailed && /*#__PURE__*/ _jsxDEV("div", {
                    style: {
                        marginTop: '8px',
                        fontSize: '10px',
                        color: '#888'
                    },
                    children: "Object Pool Active"
                }, void 0, false, {
                    fileName: "PerformanceMonitor.jsx",
                    lineNumber: 161,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "PerformanceMonitor.jsx",
            lineNumber: 141,
            columnNumber: 9
        }, this), document.body)
    }, void 0, false);
}
