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
import React, { useRef, useState } from 'react';
import * as THREE from 'three'; // Add import for THREE
import { useFrame } from '@react-three/fiber';
import { Dodecahedron } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier'; // Import RigidBody
import { useParticles } from './hooksUseParticles.js'; // Make sure this hook is correctly imported
import useAudioManager from './hooksUseAudioManager.js';
import useGameStore from './stateStore.js';
import { CrystalMaterial } from './CrystalShaderMaterial.js'; // Import the custom material
/**
 * Collectible crystal; spins slowly and awards points on click.
 * Props: position [array], value (number, default 10), onCollected (cb)
 */ // Changed to named export
export var Crystal = function(param) {
    var _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position, _param_value = param.value, value = _param_value === void 0 ? 10 : _param_value, onCollected = param.onCollected;
    var rigidBody = useRef(); // Ref for the RigidBody
    var mesh = useRef(); // Ref for the visible mesh
    var _useState = _sliced_to_array(useState(false), 2), collected = _useState[0], setCollected = _useState[1];
    var emitBurst = useParticles().emitBurst; // Get the particle emitter function
    var audio = useAudioManager();
    var addScore = useGameStore(function(s) {
        return s.addScore;
    });
    // Apply rotation directly to the mesh inside the RigidBody
    useFrame(function(state, dt) {
        if (!mesh.current) return;
        mesh.current.rotation.y += dt * 0.5; // Keep the slow spin
        // Add subtle bobbing
        var bobFrequency = 1.5;
        var bobAmplitude = 0.05;
        mesh.current.position.y = Math.sin(state.clock.elapsedTime * bobFrequency) * bobAmplitude;
        // Update shader time uniform if the material exists
        if (mesh.current.material && mesh.current.material.uniforms) {
            mesh.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });
    var handleClick = function(e) {
        e.stopPropagation(); // Prevent clicks passing through to other objects
        if (collected) return;
        setCollected(true);
        addScore(value);
        // Check if audio is ready before playing
        if (audio) {
        // TODO: Re-enable sound playback when assets are added
        // audio.play('collect', { volume: 0.7 });
        } else {
            console.warn("AudioManager not ready to play 'collect'");
        }
        // Emit particles from the visual mesh's world position
        if (mesh.current && emitBurst) {
            var worldPos = mesh.current.getWorldPosition(new THREE.Vector3());
            // Emit a burst of particles at the crystal's location with a matching color
            emitBurst(worldPos, 0x66ffcc);
        }
        if (onCollected) onCollected(); // Callback if provided
    };
    // Don't render if collected
    if (collected) return null;
    return /*#__PURE__*/ _jsxDEV(RigidBody, {
        ref: rigidBody,
        type: "fixed" // Doesn't move due to physics, only placed
        ,
        colliders: "ball" // Simple collider shape
        ,
        sensor: true,
        position: position,
        children: /*#__PURE__*/ _jsxDEV(Dodecahedron, {
            ref: mesh,
            args: [
                0.25
            ],
            // Position is now relative to the RigidBody (0,0,0)
            onPointerDown: handleClick,
            castShadow: true,
            receiveShadow: true,
            children: /*#__PURE__*/ _jsxDEV("crystalMaterial", {
                attach: "material"
            }, CrystalMaterial.key, false, {
                fileName: "componentsCrystal.jsx",
                lineNumber: 74,
                columnNumber: 11
            }, _this)
        }, void 0, false, {
            fileName: "componentsCrystal.jsx",
            lineNumber: 65,
            columnNumber: 9
        }, _this)
    }, void 0, false, {
        fileName: "componentsCrystal.jsx",
        lineNumber: 58,
        columnNumber: 5
    }, _this);
};
