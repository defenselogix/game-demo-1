/**
 * PerformanceManager - Handles performance monitoring and adaptive quality settings
 * 
 * This singleton manages:
 * - Performance tier detection
 * - Quality setting presets
 * - Dynamic quality adaptation based on frame rate
 * - Frame time monitoring
 */ // Performance tiers for different device capabilities
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
export var PERFORMANCE_TIER = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high' // High-end hardware
};
var _obj;
// Quality presets that map to performance tiers
export var QUALITY_PRESETS = (_obj = {}, _define_property(_obj, PERFORMANCE_TIER.LOW, {
    particleCount: 100,
    shadowQuality: false,
    waterResolution: 64,
    usePostProcessing: false,
    reflectionQuality: 'low',
    maxPhysicsObjects: 20,
    textureQuality: 'low',
    viewDistance: 15
}), _define_property(_obj, PERFORMANCE_TIER.MEDIUM, {
    particleCount: 200,
    shadowQuality: true,
    waterResolution: 128,
    usePostProcessing: true,
    reflectionQuality: 'medium',
    maxPhysicsObjects: 40,
    textureQuality: 'medium',
    viewDistance: 25
}), _define_property(_obj, PERFORMANCE_TIER.HIGH, {
    particleCount: 400,
    shadowQuality: true,
    waterResolution: 256,
    usePostProcessing: true,
    reflectionQuality: 'high',
    maxPhysicsObjects: 80,
    textureQuality: 'high',
    viewDistance: 40
}), _obj);
var PerformanceManager = function PerformanceManager() {
    "use strict";
    var _this = this;
    _class_call_check(this, PerformanceManager);
    /**
   * Detects device capabilities and sets initial performance tier
   */ _define_property(this, "detectDeviceCapabilities", function() {
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Check for WebGL2 support and capabilities
        var gl;
        try {
            var canvas = document.createElement('canvas');
            gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        } catch (e) {
            console.warn('WebGL detection failed:', e);
        }
        // Logic for tier detection
        if (isMobile || !gl) {
            // Mobile or no WebGL support = low tier
            _this.performanceTier = PERFORMANCE_TIER.LOW;
        } else {
            // Check for high-end indicators
            var isHighEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8 && gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 8192 && window.devicePixelRatio > 1;
            _this.performanceTier = isHighEnd ? PERFORMANCE_TIER.HIGH : PERFORMANCE_TIER.MEDIUM;
        }
        // Apply the detected tier's preset
        _this.applyPreset(_this.performanceTier);
        console.log("Device capability detection complete: ".concat(_this.performanceTier, " tier"));
        return _this.performanceTier;
    });
    /**
   * Updates the frame time tracking with the latest delta time
   */ _define_property(this, "updateFrameTime", function(deltaTime) {
        // Convert to milliseconds for easier human reading
        var frameTimeMs = deltaTime * 1000;
        // Add to rolling average
        _this.frameTimes.push(frameTimeMs);
        if (_this.frameTimes.length > _this.frameSamples) {
            _this.frameTimes.shift();
        }
        // Check if we need to adapt quality after collecting enough samples
        if (_this.adaptationEnabled && _this.frameTimes.length >= _this.frameSamples) {
            _this.checkForAdaptation();
        }
    });
    /**
   * Checks if quality settings need to be adapted based on performance
   */ _define_property(this, "checkForAdaptation", function() {
        if (!_this.adaptationEnabled || _this.isAdapting) return;
        var currentFrameRate = _this.getCurrentFrameRate();
        // Only adapt if frame rate is outside thresholds
        if (currentFrameRate < _this.lowerThreshold) {
            _this.isAdapting = true;
            // Step down to lower quality if possible
            if (_this.performanceTier === PERFORMANCE_TIER.HIGH) {
                _this.applyPreset(PERFORMANCE_TIER.MEDIUM);
                console.log('Performance adaptation: Reduced to medium quality');
            } else if (_this.performanceTier === PERFORMANCE_TIER.MEDIUM) {
                _this.applyPreset(PERFORMANCE_TIER.LOW);
                console.log('Performance adaptation: Reduced to low quality');
            }
            // Reset adaptation after a cooldown
            setTimeout(function() {
                _this.isAdapting = false;
                _this.frameTimes = []; // Reset samples
            }, 5000);
        } else if (currentFrameRate > _this.upperThreshold && _this.performanceTier !== PERFORMANCE_TIER.HIGH) {
        // Potentially increase quality, but be more conservative about this
        // Implementation would be similar to the above with appropriate logic
        }
    });
    /**
   * Gets the current estimated frame rate based on samples
   */ _define_property(this, "getCurrentFrameRate", function() {
        if (_this.frameTimes.length === 0) return 60; // Default
        var avgFrameTime = _this.frameTimes.reduce(function(sum, time) {
            return sum + time;
        }, 0) / _this.frameTimes.length;
        return Math.min(60, Math.round(1000 / avgFrameTime)); // Cap at 60fps for consistency
    });
    /**
   * Applies a quality preset by tier name
   */ _define_property(this, "applyPreset", function(tier) {
        if (!QUALITY_PRESETS[tier]) {
            console.warn("Invalid quality preset: ".concat(tier));
            return;
        }
        _this.performanceTier = tier;
        _this.qualitySettings = _object_spread({}, QUALITY_PRESETS[tier]);
        // Notify listeners of the change
        _this.notifyListeners();
        return _this.qualitySettings;
    });
    /**
   * Sets a specific quality setting
   */ _define_property(this, "setQualitySetting", function(paramName, value) {
        if (_this.qualitySettings[paramName] === undefined) {
            console.warn("Unknown quality setting: ".concat(paramName));
            return;
        }
        _this.qualitySettings[paramName] = value;
        // Notify listeners of the change
        _this.notifyListeners();
        return _this.qualitySettings;
    });
    /**
   * Enables or disables automatic quality adaptation
   */ _define_property(this, "setAdaptationEnabled", function(enabled) {
        _this.adaptationEnabled = !!enabled;
    });
    /**
   * Gets the current quality settings object
   */ _define_property(this, "getQualitySettings", function() {
        return _object_spread({}, _this.qualitySettings);
    });
    /**
   * Gets the current performance tier
   */ _define_property(this, "getPerformanceTier", function() {
        return _this.performanceTier;
    });
    /**
   * Add a listener for quality setting changes
   */ _define_property(this, "addListener", function(callback) {
        if (typeof callback === 'function' && !_this.listeners.includes(callback)) {
            _this.listeners.push(callback);
        }
    });
    /**
   * Remove a listener
   */ _define_property(this, "removeListener", function(callback) {
        _this.listeners = _this.listeners.filter(function(cb) {
            return cb !== callback;
        });
    });
    /**
   * Notify all listeners of setting changes
   */ _define_property(this, "notifyListeners", function() {
        _this.listeners.forEach(function(callback) {
            try {
                callback(_this.qualitySettings, _this.performanceTier);
            } catch (e) {
                console.error('Error in performance manager listener:', e);
            }
        });
    });
    // Default to medium quality until we detect capabilities
    this.performanceTier = PERFORMANCE_TIER.MEDIUM;
    this.qualitySettings = _object_spread({}, QUALITY_PRESETS[PERFORMANCE_TIER.MEDIUM]);
    // Performance monitoring
    this.frameTimes = [];
    this.frameSamples = 60; // Number of frames to average
    this.adaptationEnabled = true;
    this.listeners = [];
    this.isAdapting = false;
    // Frame rate thresholds for adaptation
    this.targetFrameRate = 60;
    this.lowerThreshold = 40;
    this.upperThreshold = 55;
    // Call detection on init with a slight delay to allow the app to stabilize
    setTimeout(function() {
        return _this.detectDeviceCapabilities();
    }, 500);
};
// Export a singleton instance
var performanceManager = new PerformanceManager();
export default performanceManager;
