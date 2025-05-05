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
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
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
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
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
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
import * as THREE from 'three';
/**
 * BabelHelpers.js
 * This file contains utility functions for animations and calculations in the GameScene
 */ // Fish movement patterns
function calculateSwimMotion(time, speed, range) {
    var xOffset = Math.sin(time * speed) * range;
    var zOffset = Math.sin(time * speed * 2) * (range / 2);
    return [
        xOffset,
        zOffset
    ];
}
// Calculate fish rotation based on movement direction
function calculateFishRotation(time, speed, range, currentOffset) {
    var _currentOffset = _sliced_to_array(currentOffset, 2), xOffset = _currentOffset[0], zOffset = _currentOffset[1];
    var nextX = Math.sin((time + 0.1) * speed) * range;
    var nextZ = Math.sin((time + 0.1) * speed * 2) * (range / 2);
    return Math.atan2(nextZ - zOffset, nextX - xOffset);
}
// Smoothly interpolate between current and target values
function lerpValue(current, target, factor) {
    return THREE.MathUtils.lerp(current, target, factor);
}
// Generate random position within bounds
function randomPosition(bounds) {
    var centerPosition = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [
        0,
        0,
        0
    ];
    var x = centerPosition[0] + (Math.random() * bounds[0] * 2 - bounds[0]);
    var y = centerPosition[1] + (Math.random() * bounds[1] - bounds[1] * 0.5);
    var z = centerPosition[2] + (Math.random() * bounds[2] * 2 - bounds[2]);
    return [
        x,
        y,
        z
    ];
}
// Generate random scale with base size
function randomScale() {
    var baseSize = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0.2;
    var size = baseSize + Math.random() * baseSize;
    return [
        size * (0.8 + Math.random() * 0.4),
        size * (0.4 + Math.random() * 0.2),
        size * (0.8 + Math.random() * 0.4)
    ];
}
// Convert degrees to radians
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}
// Convert radians to degrees
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}
// Clamp value between min and max
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
// Create Vector3 from array
function createVector3(array) {
    return _construct(THREE.Vector3, _to_consumable_array(array));
}
export { calculateSwimMotion, calculateFishRotation, lerpValue, randomPosition, randomScale, degToRad, radToDeg, clamp, createVector3 };
