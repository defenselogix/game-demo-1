import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
/**
 * Reference-style “lo-fi dream water”.
 * Accepts `level` (y-height) so parent can place it inside the tank.
 */ var RIPPLE_SPEED = 0.006;
var AMPLITUDE = 0.01;
var WAVELENGTH = 2.4;
var COLOR_SHALLOW = 0xdde8ff;
var COLOR_DEEP = 0x8aa4ff;
var OPACITY = 0.35;
export default function WaterSurface(param) {
    var _param_size = param.size, size = _param_size === void 0 ? 20 : _param_size, _param_level = param.level, level = _param_level === void 0 ? 1 : _param_level;
    var mat = useRef();
    useFrame(function(_, d) {
        return mat.current.uniforms.uTime.value += d * RIPPLE_SPEED;
    });
    return /*#__PURE__*/ _jsxDEV("mesh", {
        position: [
            0,
            level,
            0
        ],
        "rotation-x": -Math.PI / 2,
        children: [
            /*#__PURE__*/ _jsxDEV("planeGeometry", {
                args: [
                    size,
                    size,
                    128,
                    128
                ]
            }, void 0, false, {
                fileName: "WaterSurface.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("shaderMaterial", {
                ref: mat,
                transparent: true,
                depthWrite: false,
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uShallow: {
                        value: new THREE.Color(COLOR_SHALLOW)
                    },
                    uDeep: {
                        value: new THREE.Color(COLOR_DEEP)
                    }
                },
                vertexShader: "\n          uniform float uTime;\n          varying vec2 vUv;\n          void main() {\n            vUv = uv;\n            vec3 p = position;\n            p.z += sin((p.x + p.y) / ".concat(WAVELENGTH, " + uTime)       * ").concat(AMPLITUDE, ";\n            p.z += cos((p.x - p.y) / ").concat(WAVELENGTH, " + uTime * 0.5) * ").concat(AMPLITUDE * 0.6, ";\n            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);\n          }\n        "),
                fragmentShader: "\n          uniform vec3 uShallow;\n          uniform vec3 uDeep;\n          varying vec2 vUv;\n          float hash(vec2 p){ return fract(sin(dot(p, vec2(27.1,91.7))) * 43758.5453); }\n          void main(){\n            vec3 col = mix(uDeep, uShallow, vUv.y);\n            float n  = hash(floor(vUv*256.0)) * 0.04;\n            gl_FragColor = vec4(col + n, ".concat(OPACITY, ");\n          }\n        ")
            }, void 0, false, {
                fileName: "WaterSurface.jsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "WaterSurface.jsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
