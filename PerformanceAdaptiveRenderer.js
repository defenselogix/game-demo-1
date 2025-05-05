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
import React, { useEffect, useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { usePerformance } from './hooksUsePerformance.js';
/**
 * PerformanceAdaptiveRenderer component that automatically adjusts rendering
 * settings based on device performance capabilities.
 * 
 * This component monitors performance and dynamically adjusts:
 * - Pixel ratio
 * - Shadow map size
 * - Number of visible objects
 * - Render priority for transparent objects
 * - Post-processing effects
 */ export var PerformanceAdaptiveRenderer = function(param) {
    var children = param.children;
    var _useThree = useThree(), gl = _useThree.gl, scene = _useThree.scene, camera = _useThree.camera;
    var frameCountRef = useRef(0);
    var _useState = _sliced_to_array(useState(false), 2), isInitialized = _useState[0], setIsInitialized = _useState[1];
    // Get performance settings from our hook
    var _usePerformance = usePerformance(), qualitySettings = _usePerformance.qualitySettings, performanceTier = _usePerformance.performanceTier, updateFrameTime = _usePerformance.updateFrameTime, frameRate = _usePerformance.frameRate;
    // Apply quality settings based on device capabilities
    useEffect(function() {
        if (!gl || !scene || !camera) return;
        console.log("Applying ".concat(performanceTier, " quality settings:"), qualitySettings);
        // Adjust pixel ratio based on performance tier
        var targetPixelRatio;
        switch(performanceTier){
            case 'low':
                targetPixelRatio = Math.min(1.0, window.devicePixelRatio);
                break;
            case 'medium':
                targetPixelRatio = Math.min(1.5, window.devicePixelRatio);
                break;
            case 'high':
                targetPixelRatio = window.devicePixelRatio;
                break;
            default:
                targetPixelRatio = Math.min(1.5, window.devicePixelRatio);
        }
        gl.setPixelRatio(targetPixelRatio);
        // Configure shadow settings
        if (qualitySettings.shadowQuality) {
            gl.shadowMap.enabled = true;
            // Find and configure all shadow-casting lights
            scene.traverse(function(object) {
                if (object.isLight && object.castShadow) {
                    // Adjust shadow map size based on performance tier
                    if (object.shadow) {
                        if (performanceTier === 'low') {
                            object.shadow.mapSize.width = 512;
                            object.shadow.mapSize.height = 512;
                        } else if (performanceTier === 'medium') {
                            object.shadow.mapSize.width = 1024;
                            object.shadow.mapSize.height = 1024;
                        } else {
                            object.shadow.mapSize.width = 2048;
                            object.shadow.mapSize.height = 2048;
                        }
                    }
                }
            });
        } else {
            gl.shadowMap.enabled = false;
        }
        // Apply physics settings
        // This requires integration with the physics system in the game
        // Mark initialization as complete
        setIsInitialized(true);
    }, [
        gl,
        scene,
        camera,
        qualitySettings,
        performanceTier
    ]);
    // Track frame time and provide it to the performance manager
    useFrame(function(state, delta) {
        // Skip first few frames to avoid initialization spikes
        if (frameCountRef.current < 10) {
            frameCountRef.current++;
            return;
        }
        // Update performance manager with frame time
        updateFrameTime(delta);
        // Apply dynamic quality adjustments based on current frame rate, but preserve critical elements
        if (isInitialized && frameRate < 30 && gl.shadowMap.enabled) {
            // Dynamic adjustment if performance drops during gameplay
            scene.traverse(function(object) {
                if (object.isMesh && object.material) {
                    // Preserve critical visual elements like bubbles and caustics
                    var isCriticalElement = object.name.includes('bubble') || object.name.includes('caustic') || object.userData && (object.userData.isBubble || object.userData.isCaustics || object.userData.isWaterSurface);
                    // Skip optimizations for critical elements
                    if (isCriticalElement) return;
                    // Reduce shadow quality dynamically but only for non-critical elements
                    if (object.castShadow && frameRate < 20) {
                        object.castShadow = false;
                    }
                    // Simplify materials dynamically on very low performance
                    if (frameRate < 15 && object.material.roughness !== undefined) {
                        object.material.flatShading = true;
                    }
                }
            });
        }
    });
    // Apply specific optimizations to scene objects based on quality settings
    useEffect(function() {
        if (!scene || !isInitialized) return;
        // Ensure we have a minimum particle count for critical effects
        var minParticleCount = 80; // Ensure at least this many particles for visual clarity
        var safeParticleCount = Math.max(minParticleCount, qualitySettings.particleCount);
        // Find particle systems and adjust their count with minimums
        scene.traverse(function(object) {
            // Check for particle system
            if (object.userData && object.userData.isParticleSystem) {
                if (typeof object.setParticleCount === 'function') {
                    object.setParticleCount(safeParticleCount);
                }
            }
            // Tag essential visual elements for preservation
            if (object.name.includes('bubble') || object.name.includes('caustic') || object.name.includes('water') || object.userData && (object.userData.isBubble || object.userData.isCaustics || object.userData.isWaterSurface)) {
                // Mark this as a critical visual element
                object.userData.isCriticalVisual = true;
                // Ensure critical elements are always visible
                if (object.visible !== undefined) {
                    object.visible = true;
                }
            }
            // Adjust LOD (Level of Detail) distances if objects use LOD
            if (object.isLOD) {
                // Less aggressive LOD scaling for low tier to preserve visual quality
                var lodDistanceMultiplier = performanceTier === 'low' ? 0.8 : performanceTier === 'medium' ? 1.0 : 1.3;
                // Adjust LOD distances with less aggressive scaling for critical elements
                for(var i = 0; i < object.levels.length; i++){
                    // Store original distance if not already stored
                    if (object.levels[i].originalDistance === undefined) {
                        object.levels[i].originalDistance = object.levels[i].distance;
                    }
                    // Adjust distance based on quality
                    object.levels[i].distance = object.levels[i].originalDistance * lodDistanceMultiplier;
                }
            }
            // Handle post-processing effects with more nuance
            if (object.userData && object.userData.isPostProcessingEffect) {
                // Always enable bloom and essential effects even on low quality
                if (object.name.includes('Bloom') || object.name.includes('GodRays')) {
                    object.enabled = true;
                } else {
                    // Other post-processing effects can be toggled based on quality
                    object.enabled = qualitySettings.usePostProcessing;
                }
            }
        });
    }, [
        scene,
        qualitySettings,
        performanceTier,
        isInitialized
    ]);
    return children;
};
