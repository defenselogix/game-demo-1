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
var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useMemo, forwardRef, useEffect } from 'react';
import * as THREE from 'three';
// Remove fiber-specific imports that cause hooks errors
// Create a standard shader material without using drei's shaderMaterial
var causticsMaterialParams = {
    uniforms: {
        uTime: {
            value: 0
        },
        uColor: {
            value: new THREE.Color('#ffffff')
        },
        uIntensity: {
            value: 0.3
        },
        uSpeed: {
            value: 0.05
        },
        uScale: {
            value: 5.0
        },
        uDetail: {
            value: 2.0
        },
        uDistortion: {
            value: 0.3
        },
        uShadowIntensity: {
            value: 0.7
        }
    },
    vertexShader: "\n    varying vec2 vUv;\n    varying vec3 vPosition;\n    varying vec3 vNormal;\n    \n    void main() {\n      vUv = uv;\n      vPosition = position;\n      vNormal = normal;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    }\n  ",
    fragmentShader: "\n    uniform float uTime;\n    uniform vec3 uColor;\n    uniform float uIntensity;\n    uniform float uSpeed;\n    uniform float uScale;\n    uniform float uDetail;\n    uniform float uDistortion;\n    uniform float uShadowIntensity;\n    \n    varying vec2 vUv;\n    varying vec3 vPosition;\n    varying vec3 vNormal;\n    \n    // Hash function\n    vec3 hash3(vec2 p) {\n      vec3 q = vec3(\n        dot(p, vec2(127.1, 311.7)),\n        dot(p, vec2(269.5, 183.3)),\n        dot(p, vec2(419.2, 371.9))\n      );\n      return fract(sin(q) * 43758.5453);\n    }\n    \n    // Voronoi function for caustic patterns\n    float voronoi(vec2 x) {\n      vec2 p = floor(x);\n      vec2 f = fract(x);\n      \n      float res = 1.0;\n      for(int j = -1; j <= 1; j++) {\n        for(int i = -1; i <= 1; i++) {\n          vec2 b = vec2(i, j);\n          vec3 r = hash3(p + b);\n          \n          // Animation\n          r.xy = sin(uTime * uSpeed + r.xy * 6.28) * 0.5 + 0.5;\n          \n          vec2 diff = b + r.xy - f;\n          float d = length(diff);\n          \n          res = min(res, d);\n        }\n      }\n      \n      return res;\n    }\n    \n    // 2D Simplex noise\n    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\n    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\n    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }\n    \n    float snoise(vec2 v) {\n      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);\n      vec2 i  = floor(v + dot(v, C.yy));\n      vec2 x0 = v - i + dot(i, C.xx);\n      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n      vec4 x12 = x0.xyxy + C.xxzz;\n      x12.xy -= i1;\n      i = mod289(i);\n      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));\n      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);\n      m = m*m;\n      m = m*m;\n      vec3 x = 2.0 * fract(p * C.www) - 1.0;\n      vec3 h = abs(x) - 0.5;\n      vec3 ox = floor(x + 0.5);\n      vec3 a0 = x - ox;\n      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);\n      vec3 g;\n      g.x  = a0.x  * x0.x  + h.x  * x0.y;\n      g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n      return 130.0 * dot(m, g);\n    }\n    \n    void main() {\n      // Create caustics pattern by layering voronoi cells at different scales\n      vec2 distortedUV = vUv;\n      \n      // Add distortion based on noise\n      distortedUV.x += snoise(vUv * 2.0 + uTime * 0.1) * uDistortion;\n      distortedUV.y += snoise(vUv * 2.0 + uTime * 0.15 + 0.5) * uDistortion;\n      \n      // Create multi-scale caustics effect\n      float v1 = voronoi(distortedUV * uScale);\n      float v2 = voronoi(distortedUV * uScale * 2.0 + 0.5);\n      float v3 = voronoi(distortedUV * uScale * 4.0 + 1.0);\n      \n      // Combine patterns with different weights for detail\n      float caustic = pow(v1, 1.5) * 0.6 + pow(v2, 1.8) * 0.3 + pow(v3, 2.0) * 0.1;\n      \n      // Enhance contrast\n      caustic = smoothstep(0.2, 0.7, caustic);\n      \n      // Make edges stronger\n      float edge = 1.0 - caustic;\n      edge = pow(edge, uDetail);\n      \n      // Create final caustic value with intensity\n      float finalCaustic = edge * uIntensity;\n      \n      // Add shadow around edges\n      float shadow = 1.0 - smoothstep(0.3, 0.7, caustic);\n      shadow = pow(shadow, 0.5) * uShadowIntensity * 0.3;\n      \n      // Combine caustic highlight and shadow\n      float finalValue = finalCaustic - shadow;\n      \n      // Apply to color\n      vec3 finalColor = uColor * finalValue;\n      \n      gl_FragColor = vec4(finalColor, finalValue);\n    }\n  "
};
export var UnderwaterCaustics = /*#__PURE__*/ forwardRef(function(param, ref) {
    var _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position, _param_rotation = param.rotation, rotation = _param_rotation === void 0 ? [
        -Math.PI / 2,
        0,
        0
    ] : _param_rotation, _param_scale = param.scale, scale = _param_scale === void 0 ? [
        15,
        15,
        15
    ] : _param_scale, _param_color = param.color, color = _param_color === void 0 ? "#ffffff" : _param_color, _param_intensity = param.intensity, intensity = _param_intensity === void 0 ? 0.35 : _param_intensity, _param_speed = param.speed, speed = _param_speed === void 0 ? 0.05 : _param_speed, tmp = param.scale, patternScale = tmp === void 0 ? 5.0 : tmp, _param_detail = param.detail, detail = _param_detail === void 0 ? 2.0 : _param_detail, _param_distortion = param.distortion, distortion = _param_distortion === void 0 ? 0.3 : _param_distortion, _param_shadowIntensity = param.shadowIntensity, shadowIntensity = _param_shadowIntensity === void 0 ? 0.7 : _param_shadowIntensity;
    // Make update method available to parent components via ref
    React.useImperativeHandle(ref, function() {
        return {
            update: update
        };
    });
    var materialRef = useRef();
    // Instead of using useFrame directly, we'll update via a method call
    var update = function(time) {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = time;
        }
    };
    // Create the material in component render
    var material = useMemo(function() {
        // Create a new ShaderMaterial
        var mat = new THREE.ShaderMaterial(_object_spread_props(_object_spread({}, causticsMaterialParams), {
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        // Update the uniforms with prop values
        mat.uniforms.uColor.value = new THREE.Color(color);
        mat.uniforms.uIntensity.value = intensity;
        mat.uniforms.uSpeed.value = speed;
        mat.uniforms.uScale.value = patternScale;
        mat.uniforms.uDetail.value = detail;
        mat.uniforms.uDistortion.value = distortion;
        mat.uniforms.uShadowIntensity.value = shadowIntensity;
        return mat;
    }, [
        color,
        intensity,
        speed,
        patternScale,
        detail,
        distortion,
        shadowIntensity
    ]);
    // Set material ref when it changes
    useEffect(function() {
        materialRef.current = material;
    }, [
        material
    ]);
    // Create a larger sphere for the caustics to project onto the entire scene
    return /*#__PURE__*/ _jsxDEV("mesh", {
        position: position,
        rotation: rotation,
        scale: scale,
        renderOrder: 10,
        children: [
            /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                args: [
                    1,
                    32,
                    32
                ]
            }, void 0, false, {
                fileName: "UnderwaterCaustics.jsx",
                lineNumber: 205,
                columnNumber: 7
            }, _this),
            " ",
            /*#__PURE__*/ _jsxDEV("primitive", {
                object: material,
                attach: "material"
            }, void 0, false, {
                fileName: "UnderwaterCaustics.jsx",
                lineNumber: 206,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "UnderwaterCaustics.jsx",
        lineNumber: 199,
        columnNumber: 5
    }, _this);
}); // Component removed to prevent useFrame hooks errors when used outside of Canvas
