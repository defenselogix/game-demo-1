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
var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import * as THREE from 'three'; // Import THREE for Vector3 and distance checks
import { Crystal } from './componentsCrystal.js';
// Define Tank and Rock geometry constants (derived from envMeshes.js & GameScene.jsx)
var TANK_POSITION = new THREE.Vector3(0, 2.55, -2.5);
var TANK_INNER_SIZE = {
    width: 15.8,
    height: 4.9,
    depth: 15.8
}; // Approx inner dimensions
var TANK_FLOOR_Y = TANK_POSITION.y - TANK_INNER_SIZE.height / 2 + 0.1; // Approx floor Y
var TANK_CEILING_Y = TANK_POSITION.y + TANK_INNER_SIZE.height / 2 - 0.1; // Approx ceiling Y
var CRYSTAL_RADIUS = 0.25; // Keep in sync with Crystal.jsx args
var SPAWN_BUFFER = 0.3; // Extra space around rocks
// Rock exclusion zones [worldPosition: Vector3, exclusionRadius: number]
var ROCK_ZONES_RELATIVE = [
    // Rock 1: Rel Pos [-3.2, -2.25, 4.8], Radius 0.3
    {
        center: new THREE.Vector3(-3.2, -2.25, 4.8),
        radius: 0.3
    },
    // Rock 2: Rel Pos [4.8, -2.15, -3.2], Radius 0.5
    {
        center: new THREE.Vector3(4.8, -2.15, -3.2),
        radius: 0.5
    },
    // Rock 3: Rel Pos [1.6, -2.3, 1.6], Radius 0.2
    {
        center: new THREE.Vector3(1.6, -2.3, 1.6),
        radius: 0.2
    }
];
/**
 * CrystalManager React component.
 * Spawns crystals at random valid positions within the tank on a timer.
 */ export var CrystalManager = function(param) {
    var _param_spawnInterval = param.spawnInterval, spawnInterval = _param_spawnInterval === void 0 ? 5 : _param_spawnInterval, _param_maxCrystals = param.maxCrystals, maxCrystals = _param_maxCrystals === void 0 ? 8 : _param_maxCrystals;
    var _useState = _sliced_to_array(useState([]), 2), crystals = _useState[0], setCrystals = _useState[1];
    // Calculate world positions for rock zones once
    var rockZonesWorld = useMemo(function() {
        return ROCK_ZONES_RELATIVE.map(function(zone) {
            return {
                center: new THREE.Vector3().addVectors(zone.center, TANK_POSITION),
                radius: zone.radius + CRYSTAL_RADIUS + SPAWN_BUFFER
            };
        });
    }, []);
    // Function to generate a valid spawn position
    var generateValidPosition = function() {
        var maxRetries = 10;
        for(var i = 0; i < maxRetries; i++){
            // Generate random position within approximate inner tank bounds
            var x = TANK_POSITION.x + (Math.random() - 0.5) * (TANK_INNER_SIZE.width - CRYSTAL_RADIUS * 2);
            var y = TANK_FLOOR_Y + CRYSTAL_RADIUS + Math.random() * (TANK_INNER_SIZE.height - CRYSTAL_RADIUS * 2);
            var z = TANK_POSITION.z + (Math.random() - 0.5) * (TANK_INNER_SIZE.depth - CRYSTAL_RADIUS * 2);
            var potentialPos = new THREE.Vector3(x, y, z);
            // Check collision with rock zones
            var collision = false;
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = rockZonesWorld[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var zone = _step.value;
                    if (potentialPos.distanceTo(zone.center) < zone.radius) {
                        collision = true;
                        break; // Collides with this rock, no need to check others
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            // If no collision, return the position as an array
            if (!collision) {
                return [
                    potentialPos.x,
                    potentialPos.y,
                    potentialPos.z
                ];
            }
        }
        console.warn("CrystalManager: Could not find valid spawn position after retries.");
        return null; // Indicate failure to find position
    };
    // Spawn timer
    useEffect(function() {
        var id = setInterval(function() {
            // Only spawn if below max crystal count
            if (crystals.length >= maxCrystals) return;
            var pos = generateValidPosition();
            if (pos) {
                // Add new crystal data to the state
                setCrystals(function(arr) {
                    return _to_consumable_array(arr).concat([
                        {
                            id: crypto.randomUUID(),
                            pos: pos
                        }
                    ]);
                });
            }
        }, spawnInterval * 1000); // Convert seconds to ms
        // Cleanup function to clear interval on unmount
        return function() {
            return clearInterval(id);
        };
    }, [
        spawnInterval,
        crystals.length,
        maxCrystals,
        rockZonesWorld
    ]); // Add dependencies
    // Remove crystal when collected by filtering the state array
    var handleCollected = function(id) {
        return setCrystals(function(arr) {
            return arr.filter(function(c) {
                return c.id !== id;
            });
        });
    };
    // Render all currently active crystals
    return crystals.map(function(c) {
        return /*#__PURE__*/ _jsxDEV(Crystal, {
            position: c.pos,
            onCollected: function() {
                return handleCollected(c.id);
            }
        }, c.id, false, {
            fileName: "managersCrystalManager.js",
            lineNumber: 75,
            columnNumber: 5
        }, _this);
    });
};
