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
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
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
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createPhysicsCluster } from './utilsPhysicsCluster.js';
/**
 * Component that manages multiple physics clusters with different properties
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.world - Rapier physics world
 * @param {Object} props.rapier - Rapier physics instance
 * @param {Object} props.tankBounds - Tank boundaries
 * @param {Object} props.clusterConfigs - Configurations for different clusters
 * @param {boolean} props.enabled - Whether physics is enabled
 * @param {Function} props.onClusterInit - Callback when a cluster is initialized
 * @param {Function} props.onClusterUpdate - Callback during cluster updates
 * @param {Function} props.onClusterRemoved - Callback when a cluster is removed
 */ export function PhysicsClusterManager(param) {
    var world = param.world, rapier = param.rapier, tankBounds = param.tankBounds, _param_clusterConfigs = param.clusterConfigs, clusterConfigs = _param_clusterConfigs === void 0 ? [] : _param_clusterConfigs, _param_enabled = param.enabled, enabled = _param_enabled === void 0 ? true : _param_enabled, onClusterInit = param.onClusterInit, onClusterUpdate = param.onClusterUpdate, onClusterRemoved = param.onClusterRemoved;
    var clustersRef = useRef({});
    var _useState = _sliced_to_array(useState(function() {
        return new THREE.Scene();
    }), 1), scene = _useState[0];
    var _useState1 = _sliced_to_array(useState(false), 2), initialized = _useState1[0], setInitialized = _useState1[1];
    // Initialize clusters when configs change
    useEffect(function() {
        if (!world || !rapier || !tankBounds) return;
        // Collect IDs of current configs for cleanup
        var configIds = new Set(clusterConfigs.map(function(config) {
            return config.id;
        }));
        var currentIds = new Set(Object.keys(clustersRef.current));
        // Remove clusters that are no longer in the configs
        currentIds.forEach(function(id) {
            if (!configIds.has(id) && clustersRef.current[id]) {
                var cluster = clustersRef.current[id];
                cluster.cleanup();
                delete clustersRef.current[id];
                if (onClusterRemoved) {
                    onClusterRemoved(id);
                }
            }
        });
        // Initialize new clusters
        clusterConfigs.forEach(function(config) {
            if (!config.id || !config.prefabs || config.prefabs.length === 0) {
                console.warn('Invalid cluster config:', config);
                return;
            }
            // Skip if already initialized and not marked for reload
            if (clustersRef.current[config.id] && !config.reload) {
                return;
            }
            // Cleanup existing cluster if needed
            if (clustersRef.current[config.id]) {
                clustersRef.current[config.id].cleanup();
            }
            // Create physics cluster
            var cluster = createPhysicsCluster({
                prefabs: config.prefabs,
                tankBounds: tankBounds,
                world: world,
                rapier: rapier,
                scene: scene,
                spawnOptions: {
                    margin: config.margin || 0.1,
                    radius: config.radius || 0.5,
                    minSpacing: config.minSpacing || 0.2,
                    collisionType: config.collisionType || 'box',
                    collisionScale: config.collisionScale || 0.9,
                    mass: config.mass || 1,
                    friction: config.friction || 0.3,
                    restitution: config.restitution || 0.2,
                    visualizeCollision: config.visualizeCollision || false,
                    randomRotationY: config.randomRotationY !== false,
                    maxAttempts: config.maxAttempts || 20
                },
                onInit: function(objects) {
                    if (config.onInit) {
                        config.onInit(objects);
                    }
                    if (onClusterInit) {
                        onClusterInit(config.id, objects);
                    }
                },
                onUpdate: function(objects, deltaTime) {
                    if (config.onUpdate) {
                        config.onUpdate(objects, deltaTime);
                    }
                    if (onClusterUpdate) {
                        onClusterUpdate(config.id, objects, deltaTime);
                    }
                },
                onCleanup: function(objects) {
                    if (config.onCleanup) {
                        config.onCleanup(objects);
                    }
                }
            });
            if (cluster) {
                // Initialize the cluster
                cluster.init();
                // Store with its configuration
                clustersRef.current[config.id] = _object_spread_props(_object_spread({}, cluster), {
                    config: config
                });
            }
        });
        setInitialized(true);
        // Cleanup function
        return function() {
            // Clean up all physics clusters
            Object.values(clustersRef.current).forEach(function(cluster) {
                if (cluster && typeof cluster.cleanup === 'function') {
                    cluster.cleanup();
                }
            });
            clustersRef.current = {};
        };
    }, [
        world,
        rapier,
        tankBounds,
        clusterConfigs,
        onClusterInit,
        onClusterUpdate,
        onClusterRemoved
    ]);
    // Frame update handler
    useFrame(function(state, delta) {
        if (!enabled || !initialized) return;
        // Update all active clusters
        Object.values(clustersRef.current).forEach(function(cluster) {
            if (cluster && typeof cluster.update === 'function') {
                cluster.update(delta);
            }
        });
        // Optional: Periodically clean up invalid objects
        if (state.clock.elapsedTime % 5 < delta) {
            Object.values(clustersRef.current).forEach(function(cluster) {
                if (cluster && typeof cluster.filterInvalidObjects === 'function') {
                    cluster.filterInvalidObjects();
                }
            });
        }
    });
    // Methods exposed via ref pattern
    var getCluster = function(id) {
        return clustersRef.current[id] || null;
    };
    var applyForceToCluster = function(id, force) {
        var asImpulse = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        var cluster = getCluster(id);
        if (cluster && typeof cluster.applyForce === 'function') {
            cluster.applyForce(force, asImpulse);
            return true;
        }
        return false;
    };
    var applyExplosionToCluster = function(id, position) {
        var strength = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 10, radius = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 2;
        var cluster = getCluster(id);
        if (cluster && typeof cluster.applyExplosion === 'function') {
            cluster.applyExplosion(position, strength, radius);
            return true;
        }
        return false;
    };
    var applyExplosionToAll = function(position) {
        var strength = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10, radius = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 2;
        Object.values(clustersRef.current).forEach(function(cluster) {
            if (cluster && typeof cluster.applyExplosion === 'function') {
                cluster.applyExplosion(position, strength, radius);
            }
        });
    };
    var pauseCluster = function(id) {
        var cluster = getCluster(id);
        if (cluster && typeof cluster.pause === 'function') {
            cluster.pause();
            return true;
        }
        return false;
    };
    var resumeCluster = function(id) {
        var cluster = getCluster(id);
        if (cluster && typeof cluster.resume === 'function') {
            cluster.resume();
            return true;
        }
        return false;
    };
    var pauseAll = function() {
        Object.values(clustersRef.current).forEach(function(cluster) {
            if (cluster && typeof cluster.pause === 'function') {
                cluster.pause();
            }
        });
    };
    var resumeAll = function() {
        Object.values(clustersRef.current).forEach(function(cluster) {
            if (cluster && typeof cluster.resume === 'function') {
                cluster.resume();
            }
        });
    };
    var getTotalObjectCount = function() {
        return Object.values(clustersRef.current).reduce(function(count, cluster) {
            return count + (cluster.count || 0);
        }, 0);
    };
    // Expose methods to parent via React ref
    React.useImperativeHandle(React.useRef(), function() {
        return {
            getCluster: getCluster,
            applyForceToCluster: applyForceToCluster,
            applyExplosionToCluster: applyExplosionToCluster,
            applyExplosionToAll: applyExplosionToAll,
            pauseCluster: pauseCluster,
            resumeCluster: resumeCluster,
            pauseAll: pauseAll,
            resumeAll: resumeAll,
            getTotalObjectCount: getTotalObjectCount
        };
    });
    // Add all cluster objects to the scene
    useEffect(function() {
        return function() {
            // When component unmounts, make sure the scene is cleared
            while(scene.children.length > 0){
                var object = scene.children[0];
                scene.remove(object);
            }
        };
    }, [
        scene
    ]);
    // Render the scene containing all physics objects
    return /*#__PURE__*/ _jsxDEV("primitive", {
        object: scene
    }, void 0, false, {
        fileName: "PhysicsClusterManager.jsx",
        lineNumber: 259,
        columnNumber: 10
    }, this);
}
