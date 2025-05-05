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
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
// Create context with default values
var UIContext = /*#__PURE__*/ createContext({
    showWaterSurface: true,
    causticsIntensity: 0.4,
    toggleWaterSurface: function() {},
    setCausticsIntensity: function() {},
    showPerformanceStats: false,
    togglePerformanceStats: function() {},
    showControls: true,
    toggleControls: function() {},
    showReefInfo: true,
    toggleReefInfo: function() {}
});
// Custom hook for easy context usage
export var useUI = function() {
    return useContext(UIContext);
};
export var UIProvider = function(param) {
    var children = param.children;
    // Water surface visibility
    var _useState = _sliced_to_array(useState(true), 2), showWaterSurface = _useState[0], setShowWaterSurface = _useState[1];
    var toggleWaterSurface = useCallback(function() {
        setShowWaterSurface(function(prev) {
            return !prev;
        });
    }, []);
    // Reef information display
    var _useState1 = _sliced_to_array(useState(true), 2), showReefInfo = _useState1[0], setShowReefInfo = _useState1[1];
    var toggleReefInfo = useCallback(function() {
        setShowReefInfo(function(prev) {
            return !prev;
        });
    }, []);
    // Caustics intensity
    var _useState2 = _sliced_to_array(useState(0.4), 2), causticsIntensity = _useState2[0], setCausticsIntensity = _useState2[1];
    // Performance stats visibility
    var _useState3 = _sliced_to_array(useState(false), 2), showPerformanceStats = _useState3[0], setShowPerformanceStats = _useState3[1];
    var togglePerformanceStats = useCallback(function() {
        setShowPerformanceStats(function(prev) {
            return !prev;
        });
    }, []);
    // Controls visibility
    var _useState4 = _sliced_to_array(useState(true), 2), showControls = _useState4[0], setShowControls = _useState4[1];
    var toggleControls = useCallback(function() {
        setShowControls(function(prev) {
            return !prev;
        });
    }, []);
    // Memoize context value to prevent unnecessary re-renders
    var value = useMemo(function() {
        return {
            showWaterSurface: showWaterSurface,
            toggleWaterSurface: toggleWaterSurface,
            causticsIntensity: causticsIntensity,
            setCausticsIntensity: setCausticsIntensity,
            showPerformanceStats: showPerformanceStats,
            togglePerformanceStats: togglePerformanceStats,
            showControls: showControls,
            toggleControls: toggleControls,
            showReefInfo: showReefInfo,
            toggleReefInfo: toggleReefInfo
        };
    }, [
        showWaterSurface,
        toggleWaterSurface,
        causticsIntensity,
        setCausticsIntensity,
        showPerformanceStats,
        togglePerformanceStats,
        showControls,
        toggleControls,
        showReefInfo,
        toggleReefInfo
    ]);
    return /*#__PURE__*/ _jsxDEV(UIContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "UIContext.js",
        lineNumber: 74,
        columnNumber: 5
    }, _this);
};
