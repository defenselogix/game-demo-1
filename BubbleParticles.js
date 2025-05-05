function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
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
import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { tankMin, tankMax } from './utilsTankConstants.js';
import stateStore from './stateStore.js';
import { BubblePopEffect } from './BubblePopEffect.js';
// Pool configuration
var BUBBLE_COUNT = 100;
var INITIAL_ACTIVE_BUBBLES = 50; // Start with fewer active bubbles
var BUBBLE_SIZE_MIN = 0.02;
var BUBBLE_SIZE_MAX = 0.08;
var BUBBLE_SPEED_MIN = 0.2;
var BUBBLE_SPEED_MAX = 0.5;
var SPAWN_AREA_WIDTH = 12;
var SPAWN_AREA_DEPTH = 12;
export function BubbleParticles(param) {
    var _this = this;
    var _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position;
    // State to track active pop effects
    var _useState = _sliced_to_array(useState([]), 2), popEffects = _useState[0], setPopEffects = _useState[1];
    // Get fish position from the store
    var fishPosition = stateStore(function(state) {
        return state.fishPosition;
    });
    var fishRadius = 0.5; // approximate collision radius for the fish
    // Reference to cache floor height lookup
    var floorHeightMap = useRef(null);
    // Initialize a raycaster to find floor heights
    var raycaster = useMemo(function() {
        return new THREE.Raycaster();
    }, []);
    // Setup function to find floor height at a given x,z position
    var getFloorHeight = useRef(function(x, z) {
        return tankMin.y; // Default to tank minimum until we can find real heights
    });
    // Get access to the Three.js state
    var state = useThree();
    // Effect to setup the floor height detection
    useEffect(function() {
        // We'll perform a one-time scan of the scene to find the sand floor and mounds
        var findFloorMeshes = function() {
            // Use the Three.js scene directly instead of DOM access
            // We'll create a safer way to search for sand meshes
            var sandMeshes = [];
            // Access the scene through the current Three.js state
            var scene = state.get().scene;
            if (scene) {
                scene.traverse(function(object) {
                    // Look for meshes that are part of the sand floor system
                    if (object.isMesh && (object.name === "SandFloor" || object.name === "SandMound")) {
                        sandMeshes.push(object);
                    }
                });
            }
            return sandMeshes;
        };
        // Attempt to find floor meshes after a short delay to ensure scene is loaded
        var timeout = setTimeout(function() {
            var sandMeshes = findFloorMeshes();
            if (sandMeshes.length > 0) {
                // Update the getFloorHeight function with the actual implementation
                getFloorHeight.current = function(x, z) {
                    // Cast a ray from above the tank downward
                    var rayOrigin = new THREE.Vector3(x, tankMax.y, z);
                    var rayDirection = new THREE.Vector3(0, -1, 0);
                    raycaster.set(rayOrigin, rayDirection);
                    // Check for intersections with sand meshes
                    var intersects = raycaster.intersectObjects(sandMeshes);
                    if (intersects.length > 0) {
                        // Return the y-coordinate of the first intersection
                        return intersects[0].point.y;
                    }
                    // Fallback to default tank floor
                    return tankMin.y;
                };
                // Pre-calculate some height values for common spawn locations
                floorHeightMap.current = {};
                var gridSize = 20;
                var gridStep = SPAWN_AREA_WIDTH / gridSize;
                for(var ix = 0; ix < gridSize; ix++){
                    for(var iz = 0; iz < gridSize; iz++){
                        var x = (ix / gridSize - 0.5) * SPAWN_AREA_WIDTH + position[0];
                        var z = (iz / gridSize - 0.5) * SPAWN_AREA_DEPTH + position[2];
                        var key = "".concat(Math.round(x * 10), ",").concat(Math.round(z * 10));
                        floorHeightMap.current[key] = getFloorHeight.current(x, z);
                    }
                }
            }
        }, 500);
        return function() {
            return clearTimeout(timeout);
        };
    }, [
        position,
        raycaster
    ]);
    // Setup bubble pool - create all bubble objects once and reuse them
    var bubblePool = useMemo(function() {
        // Create a function to generate bubble properties
        var createBubbleProps = function() {
            return {
                position: new THREE.Vector3(0, 0, 0),
                size: THREE.MathUtils.randFloat(BUBBLE_SIZE_MIN, BUBBLE_SIZE_MAX),
                speed: THREE.MathUtils.randFloat(BUBBLE_SPEED_MIN, BUBBLE_SPEED_MAX),
                offset: Math.random() * Math.PI * 2,
                wobbleSpeed: THREE.MathUtils.randFloat(1, 3),
                wobbleAmount: THREE.MathUtils.randFloat(0.05, 0.15),
                sizePulseSpeed: THREE.MathUtils.randFloat(0.5, 2),
                sizePulseAmount: THREE.MathUtils.randFloat(0.05, 0.15),
                baseSizeScale: THREE.MathUtils.randFloat(0.85, 1.15),
                active: false,
                visible: false,
                popProgress: 0,
                lastResetTime: 0
            };
        };
        // Initialize the pool with all bubbles
        var pool = [];
        for(var i = 0; i < BUBBLE_COUNT; i++){
            pool.push(createBubbleProps());
        }
        return {
            bubbles: pool,
            activeBubbleCount: 0,
            getInactiveBubble: function getInactiveBubble() {
                // First try to find an inactive bubble
                for(var i = 0; i < this.bubbles.length; i++){
                    if (!this.bubbles[i].active && !this.bubbles[i].visible) {
                        return this.bubbles[i];
                    }
                }
                // If all bubbles are active/visible, find the oldest reset one
                var oldestBubble = this.bubbles[0];
                var oldestTime = Infinity;
                for(var i1 = 0; i1 < this.bubbles.length; i1++){
                    if (this.bubbles[i1].lastResetTime < oldestTime) {
                        oldestBubble = this.bubbles[i1];
                        oldestTime = this.bubbles[i1].lastResetTime;
                    }
                }
                return oldestBubble;
            },
            resetBubble: function resetBubble(bubble, spawnCenter, floorHeightFunc) {
                var x = (Math.random() - 0.5) * SPAWN_AREA_WIDTH + spawnCenter[0];
                var z = (Math.random() - 0.5) * SPAWN_AREA_DEPTH + spawnCenter[2];
                // Get proper floor height
                var y = floorHeightFunc(x, z);
                bubble.position.set(x, y + Math.random() * 0.05, z);
                bubble.active = true;
                bubble.visible = true;
                bubble.popProgress = 0;
                bubble.lastResetTime = Date.now();
                return bubble;
            }
        };
    }, []);
    // Reference to active bubbles - will be updated each frame
    var activeBubbles = useRef([]);
    // Reference to instanced mesh
    var instancedMeshRef = useRef();
    // Create matrix for each bubble
    var tempMatrix = useMemo(function() {
        return new THREE.Matrix4();
    }, []);
    var tempObj = useMemo(function() {
        return new THREE.Object3D();
    }, []);
    // Update bubble positions each frame
    // Function to check collision between fish and bubble
    var checkFishCollision = function(bubble, fishPos) {
        if (!fishPos || !bubble.active) return false;
        // Create Vector3 from fish position array
        var fishVector = new THREE.Vector3(fishPos.x, fishPos.y, fishPos.z);
        // Calculate distance between fish and bubble
        var distance = fishVector.distanceTo(bubble.position);
        // Collision detected if distance is less than combined radii
        return distance < fishRadius + bubble.size;
    };
    // Initialize pool with active bubbles gradually
    useEffect(function() {
        // Helper function to get spawn height
        var getSpawnHeight = function(x, z) {
            // First check the height map
            if (floorHeightMap.current) {
                var key = "".concat(Math.round(x * 10), ",").concat(Math.round(z * 10));
                if (floorHeightMap.current[key] !== undefined) {
                    return floorHeightMap.current[key];
                }
                // Try nearby points
                for(var offsetX = -1; offsetX <= 1; offsetX++){
                    for(var offsetZ = -1; offsetZ <= 1; offsetZ++){
                        var nearbyKey = "".concat(Math.round(x * 10) + offsetX, ",").concat(Math.round(z * 10) + offsetZ);
                        if (floorHeightMap.current[nearbyKey] !== undefined) {
                            return floorHeightMap.current[nearbyKey];
                        }
                    }
                }
            }
            return getFloorHeight.current(x, z);
        };
        // Start with initial set of active bubbles
        // Stagger bubble activation for a more natural look
        for(var i = 0; i < INITIAL_ACTIVE_BUBBLES; i++){
            // Get a bubble from the pool and activate it
            var bubble = bubblePool.getInactiveBubble();
            bubblePool.resetBubble(bubble, position, getSpawnHeight);
            // Also set a random initial height for staggered appearance
            bubble.position.y += Math.random() * (tankMax.y - tankMin.y) * 0.7;
            // Add to active bubbles
            bubblePool.activeBubbleCount++;
        }
    }, [
        bubblePool,
        position
    ]);
    // Gradually add more bubbles over time for a natural buildup
    var lastBubbleAddTime = useRef(0);
    useFrame(function(state, delta) {
        var _loop = function(i) {
            var bubble = bubblePool.bubbles[i];
            // Skip completely inactive bubbles
            if (!bubble.active && !bubble.visible) {
                // Make sure it's not visible in the scene
                tempObj.scale.set(0, 0, 0);
                tempObj.updateMatrix();
                instancedMeshRef.current.setMatrixAt(i, tempObj.matrix);
                return "continue";
            }
            // Add to active list for collision checks
            activeBubbles.current.push(bubble);
            // Handle popping animation
            if (!bubble.active && bubble.visible) {
                bubble.popProgress = Math.min(bubble.popProgress + delta * 3, 1);
                // If pop animation complete, hide the bubble
                if (bubble.popProgress >= 1) {
                    bubble.visible = false;
                    // Make it invisible in scene
                    tempObj.scale.set(0, 0, 0);
                    tempObj.updateMatrix();
                    instancedMeshRef.current.setMatrixAt(i, tempObj.matrix);
                    return "continue";
                }
            } else if (bubble.active) {
                // Update position - move upward
                bubble.position.y += bubble.speed * delta;
                // Add slight wobble
                var wobble = Math.sin(time * bubble.wobbleSpeed + bubble.offset) * bubble.wobbleAmount;
                bubble.wobbleX = wobble;
                bubble.wobbleZ = wobble * 0.5;
                // Check if bubble reached the top
                if (bubble.position.y > tankMax.y) {
                    // Get correct floor height
                    var getSpawnHeight = function(x, z) {
                        if (floorHeightMap.current) {
                            var key = "".concat(Math.round(x * 10), ",").concat(Math.round(z * 10));
                            if (floorHeightMap.current[key] !== undefined) {
                                return floorHeightMap.current[key];
                            }
                            // Check nearby positions
                            for(var offsetX = -1; offsetX <= 1; offsetX++){
                                for(var offsetZ = -1; offsetZ <= 1; offsetZ++){
                                    var nearbyKey = "".concat(Math.round(x * 10) + offsetX, ",").concat(Math.round(z * 10) + offsetZ);
                                    if (floorHeightMap.current[nearbyKey] !== undefined) {
                                        return floorHeightMap.current[nearbyKey];
                                    }
                                }
                            }
                        }
                        return getFloorHeight.current(x, z);
                    };
                    bubblePool.resetBubble(bubble, position, getSpawnHeight);
                    return "continue";
                }
                // Check collision with fish
                if (fishPosition && checkFishCollision(bubble, fishPosition)) {
                    // Bubble collided with fish, start popping
                    bubble.active = false;
                    bubble.popProgress = 0;
                    // Add pop effect at the bubble's position
                    var xPos = bubble.position.x + bubble.wobbleX;
                    var zPos = bubble.position.z + bubble.wobbleZ;
                    setPopEffects(function(prev) {
                        return _to_consumable_array(prev).concat([
                            {
                                id: "pop-".concat(Date.now(), "-").concat(Math.random()),
                                position: new THREE.Vector3(xPos, bubble.position.y, zPos),
                                size: bubble.size,
                                timestamp: Date.now()
                            }
                        ]);
                    });
                }
            }
            visibleCount++;
            // Update instance matrix for visible bubbles
            var xPos1 = bubble.position.x + (bubble.wobbleX || 0);
            var zPos1 = bubble.position.z + (bubble.wobbleZ || 0);
            tempObj.position.set(xPos1, bubble.position.y, zPos1);
            if (bubble.active) {
                // Normal bubble - possibly with size pulse
                var sizePulse = Math.sin(time * bubble.sizePulseSpeed + bubble.offset) * bubble.sizePulseAmount;
                var currentSize = bubble.size * bubble.baseSizeScale * (1 + sizePulse);
                tempObj.scale.set(currentSize, currentSize, currentSize);
            } else {
                // Popping bubble - expand then disappear
                var popScale = 1 + bubble.popProgress * 1.5; // Expand to 2.5x size
                var fadeScale = Math.max(0, 1 - bubble.popProgress * 2); // Fade out faster than expansion
                var finalSize = bubble.size * popScale * fadeScale;
                tempObj.scale.set(finalSize, finalSize, finalSize);
            }
            tempObj.updateMatrix();
            instancedMeshRef.current.setMatrixAt(i, tempObj.matrix);
        };
        if (!instancedMeshRef.current) return;
        var time = state.clock.elapsedTime;
        // Gradually add more bubbles until we reach desired count
        if (bubblePool.activeBubbleCount < BUBBLE_COUNT && time - lastBubbleAddTime.current > 0.2) {
            var getSpawnHeight = function(x, z) {
                // Using the same helper function as before
                if (floorHeightMap.current) {
                    var key = "".concat(Math.round(x * 10), ",").concat(Math.round(z * 10));
                    if (floorHeightMap.current[key] !== undefined) {
                        return floorHeightMap.current[key];
                    }
                    // Try nearby points
                    for(var offsetX = -1; offsetX <= 1; offsetX++){
                        for(var offsetZ = -1; offsetZ <= 1; offsetZ++){
                            var nearbyKey = "".concat(Math.round(x * 10) + offsetX, ",").concat(Math.round(z * 10) + offsetZ);
                            if (floorHeightMap.current[nearbyKey] !== undefined) {
                                return floorHeightMap.current[nearbyKey];
                            }
                        }
                    }
                }
                return getFloorHeight.current(x, z);
            };
            // Get a bubble from the pool and activate it
            var bubble = bubblePool.getInactiveBubble();
            bubblePool.resetBubble(bubble, position, getSpawnHeight);
            bubblePool.activeBubbleCount++;
            lastBubbleAddTime.current = time;
        }
        // Process all bubbles
        var visibleCount = 0;
        activeBubbles.current = [];
        for(var i = 0; i < bubblePool.bubbles.length; i++)_loop(i);
        // Update instance matrices
        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    });
    // Remove duplicate checkFishCollision function
    // Remove completed pop effects
    var handleEffectComplete = function(effectId) {
        setPopEffects(function(prev) {
            return prev.filter(function(effect) {
                return effect.id !== effectId;
            });
        });
    };
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV("instancedMesh", {
                ref: instancedMeshRef,
                args: [
                    null,
                    null,
                    BUBBLE_COUNT
                ],
                frustumCulled: false,
                children: [
                    /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                        args: [
                            1,
                            12,
                            12
                        ]
                    }, void 0, false, {
                        fileName: "BubbleParticles.jsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshBasicMaterial", {
                        color: "#ffffff",
                        transparent: true,
                        opacity: 0.5
                    }, void 0, false, {
                        fileName: "BubbleParticles.jsx",
                        lineNumber: 400,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "BubbleParticles.jsx",
                lineNumber: 394,
                columnNumber: 7
            }, this),
            popEffects.map(function(effect) {
                return /*#__PURE__*/ _jsxDEV(BubblePopEffect, {
                    position: effect.position,
                    size: effect.size,
                    onComplete: function() {
                        return handleEffectComplete(effect.id);
                    }
                }, effect.id, false, {
                    fileName: "BubbleParticles.jsx",
                    lineNumber: 405,
                    columnNumber: 9
                }, _this);
            })
        ]
    }, void 0, true);
}
