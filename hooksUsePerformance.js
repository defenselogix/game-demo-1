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
import { useState, useEffect, useCallback, useMemo } from 'react';
import performanceManager, { PERFORMANCE_TIER, QUALITY_PRESETS } from './PerformanceManager.js';
/**
 * Hook to access and interact with the performance manager in React components
 * 
 * @returns {Object} Performance-related state and functions
 *   - qualitySettings: Current quality settings object
 *   - performanceTier: Current performance tier ('low', 'medium', 'high')
 *   - setQualitySetting: Function to override a specific quality setting
 *   - applyPreset: Function to apply a preset quality tier
 *   - enableAdaptation: Function to enable/disable automatic quality adaptation
 *   - frameRate: Current calculated frame rate
 *   - isAdapting: Whether the system is currently adapting settings
 *   - tiers: Available performance tiers
 */ export var usePerformance = function() {
    var _useState = _sliced_to_array(useState(function() {
        return performanceManager.getQualitySettings();
    }), 2), qualitySettings = _useState[0], setQualitySettings = _useState[1];
    var _useState1 = _sliced_to_array(useState(function() {
        return performanceManager.getPerformanceTier();
    }), 2), performanceTier = _useState1[0], setPerformanceTier = _useState1[1];
    var _useState2 = _sliced_to_array(useState(60), 2), frameRate = _useState2[0], setFrameRate = _useState2[1];
    var _useState3 = _sliced_to_array(useState(false), 2), isAdapting = _useState3[0], setIsAdapting = _useState3[1];
    // Update local state when performance manager changes settings
    useEffect(function() {
        var handleSettingsChange = function(newSettings, newTier) {
            setQualitySettings(newSettings);
            setPerformanceTier(newTier);
        };
        // Register listener for performance manager changes
        performanceManager.addListener(handleSettingsChange);
        // Set up frame rate update interval
        var frameRateInterval = setInterval(function() {
            setFrameRate(performanceManager.getCurrentFrameRate());
            setIsAdapting(performanceManager.isAdapting || false);
        }, 1000);
        // Cleanup on unmount
        return function() {
            performanceManager.removeListener(handleSettingsChange);
            clearInterval(frameRateInterval);
        };
    }, []);
    // Callback to set a specific quality setting
    var setSingleQualitySetting = useCallback(function(paramName, value) {
        performanceManager.setQualitySetting(paramName, value);
    }, []);
    // Callback to apply a full quality preset
    var applyPreset = useCallback(function(tier) {
        performanceManager.applyPreset(tier);
    }, []);
    // Callback to enable/disable automatic adaptation
    var enableAdaptation = useCallback(function(enabled) {
        performanceManager.setAdaptationEnabled(enabled);
    }, []);
    // Frame time update callback for components with animation loops
    var updateFrameTime = useCallback(function(deltaTime) {
        performanceManager.updateFrameTime(deltaTime);
    }, []);
    // Public API exposed by the hook
    return useMemo(function() {
        return {
            // Current state
            qualitySettings: qualitySettings,
            performanceTier: performanceTier,
            frameRate: frameRate,
            isAdapting: isAdapting,
            // Available presets and tiers
            presets: QUALITY_PRESETS,
            tiers: PERFORMANCE_TIER,
            // Methods
            setQualitySetting: setSingleQualitySetting,
            applyPreset: applyPreset,
            enableAdaptation: enableAdaptation,
            updateFrameTime: updateFrameTime,
            // Expose detection method for manual triggering
            detectDeviceCapabilities: performanceManager.detectDeviceCapabilities
        };
    }, [
        qualitySettings,
        performanceTier,
        frameRate,
        isAdapting,
        setSingleQualitySetting,
        applyPreset,
        enableAdaptation,
        updateFrameTime
    ]);
};
