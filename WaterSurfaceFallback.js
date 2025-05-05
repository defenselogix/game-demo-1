var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
// Removed useFrame import since it can only be used within Canvas
export var WaterSurfaceFallback = /*#__PURE__*/ forwardRef(function(param, ref) {
    var _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position, _param_dimensions = param.dimensions, dimensions = _param_dimensions === void 0 ? [
        14.4,
        14.4
    ] : _param_dimensions, _param_height = param.height, height = _param_height === void 0 ? 5 : _param_height;
    var meshRef = useRef();
    var materialRef = useRef();
    // Create the water geometry
    var geometry = useMemo(function() {
        var geo = new THREE.PlaneGeometry(dimensions[0], dimensions[1], 32, 32);
        // We need to work with the vertices directly for wave effect
        // This will be modified in the animation frame
        return geo;
    }, [
        dimensions
    ]);
    // Create water uniforms for the shader
    var uniforms = useMemo(function() {
        return {
            uTime: {
                value: 0
            },
            uColor: {
                value: new THREE.Color('#2a7bb0')
            },
            uColorDeep: {
                value: new THREE.Color('#0e2c49')
            },
            uColorHighlight: {
                value: new THREE.Color('#8ad3ff')
            },
            uWaveHeight: {
                value: 0.03
            },
            uWaveSpeed: {
                value: 0.3
            },
            uWaveFrequency: {
                value: 2.0
            },
            uOpacity: {
                value: 0.78
            },
            uCausticIntensity: {
                value: 0.15
            },
            uCausticScale: {
                value: 5.0
            },
            uCausticSpeed: {
                value: 0.1
            }
        };
    }, []);
    // Custom water shader
    var waterShader = useMemo(function() {
        return {
            uniforms: uniforms,
            vertexShader: "\n      uniform float uTime;\n      uniform float uWaveHeight;\n      uniform float uWaveSpeed;\n      uniform float uWaveFrequency;\n      \n      varying vec2 vUv;\n      varying float vElevation;\n      varying vec3 vPosition;\n      varying vec3 vNormal;\n      \n      // Simplex 2D noise function\n      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }\n      float snoise(vec2 v) {\n        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);\n        vec2 i  = floor(v + dot(v, C.yy));\n        vec2 x0 = v - i + dot(i, C.xx);\n        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n        vec4 x12 = x0.xyxy + C.xxzz;\n        x12.xy -= i1;\n        i = mod(i, 289.0);\n        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));\n        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);\n        m = m*m;\n        m = m*m;\n        vec3 x = 2.0 * fract(p * C.www) - 1.0;\n        vec3 h = abs(x) - 0.5;\n        vec3 ox = floor(x + 0.5);\n        vec3 a0 = x - ox;\n        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);\n        vec3 g;\n        g.x = a0.x * x0.x + h.x * x0.y;\n        g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n        return 130.0 * dot(m, g);\n      }\n      \n      void main() {\n        vUv = uv;\n        \n        // Create complex water surface using multiple noise samples\n        float noise1 = snoise(vec2(uv.x * uWaveFrequency + uTime * uWaveSpeed * 0.2, \n                                  uv.y * uWaveFrequency - uTime * uWaveSpeed * 0.3)) * 0.5;\n        float noise2 = snoise(vec2(uv.x * uWaveFrequency * 2.0 - uTime * uWaveSpeed * 0.15, \n                                  uv.y * uWaveFrequency * 2.0 + uTime * uWaveSpeed * 0.15)) * 0.25;\n        \n        vElevation = noise1 + noise2;\n        \n        // Apply elevation to vertex position (just for visual effect, doesn't affect physics)\n        vec3 newPosition = position;\n        newPosition.y += vElevation * uWaveHeight;\n        \n        // Pass position and normal to fragment shader\n        vPosition = newPosition;\n        \n        // Calculate normal based on elevation gradient\n        // This improves light interaction and caustics\n        float eps = 0.01;\n        float nx = snoise(vec2(uv.x + eps, uv.y) * uWaveFrequency + vec2(uTime * uWaveSpeed)) - \n                   snoise(vec2(uv.x - eps, uv.y) * uWaveFrequency + vec2(uTime * uWaveSpeed));\n        float nz = snoise(vec2(uv.x, uv.y + eps) * uWaveFrequency + vec2(uTime * uWaveSpeed)) - \n                   snoise(vec2(uv.x, uv.y - eps) * uWaveFrequency + vec2(uTime * uWaveSpeed));\n        \n        vNormal = normalize(vec3(-nx, 2.0 * uWaveHeight, -nz));\n        \n        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\n      }\n    ",
            fragmentShader: "\n      uniform vec3 uColor;\n      uniform vec3 uColorDeep;\n      uniform vec3 uColorHighlight;\n      uniform float uOpacity;\n      uniform float uTime;\n      uniform float uCausticIntensity;\n      uniform float uCausticScale;\n      uniform float uCausticSpeed;\n      \n      varying vec2 vUv;\n      varying float vElevation;\n      varying vec3 vPosition;\n      varying vec3 vNormal;\n      \n      // Caustics noise functions\n      vec3 hash3(vec2 p) {\n        vec3 q = vec3(dot(p, vec2(127.1, 311.7)),\n                     dot(p, vec2(269.5, 183.3)),\n                     dot(p, vec2(419.2, 371.9)));\n        return fract(sin(q) * 43758.5453);\n      }\n      \n      float voronoi(vec2 x) {\n        vec2 p = floor(x);\n        vec2 f = fract(x);\n        \n        float res = 1.0;\n        for(int j = -1; j <= 1; j++) {\n          for(int i = -1; i <= 1; i++) {\n            vec2 b = vec2(i, j);\n            vec3 r = hash3(p + b);\n            vec2 diff = b + r.xy - f;\n            float d = length(diff);\n            res = min(res, d);\n          }\n        }\n        return res;\n      }\n      \n      // Function to generate caustic effect\n      float causticEffect(vec2 uv) {\n        // Animate UV\n        vec2 movingUV = uv * uCausticScale + vec2(uTime * uCausticSpeed);\n        \n        // Create multi-layered caustic effect\n        float v1 = voronoi(movingUV * 1.0);\n        float v2 = voronoi(movingUV * 2.0 + vec2(0.3));\n        \n        // Combine with different frequencies\n        float caustic = pow(v1 * v2 * 1.5, 1.5);\n        caustic = smoothstep(0.0, 1.0, caustic);\n        \n        return caustic;\n      }\n      \n      void main() {\n        // Create a smooth blend between colors based on elevation\n        float waterDepth = smoothstep(-0.05, 0.05, vElevation);\n        \n        // Mix between deep water color and regular water color\n        vec3 waterColor = mix(uColorDeep, uColor, waterDepth);\n        \n        // Add subtle highlights on the wave peaks\n        waterColor = mix(waterColor, uColorHighlight, smoothstep(0.02, 0.08, vElevation) * 0.3);\n        \n        // Add edge foam effect\n        float edgeX = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);\n        float edgeY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);\n        float edge = edgeX * edgeY;\n        \n        // Generate caustics\n        float caustic = causticEffect(vUv);\n        \n        // Add view-dependent lighting effect based on normal\n        vec3 viewDir = normalize(vec3(0.0, 1.0, 0.5)); // Assuming camera above and slightly to side\n        float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 1.5);\n        \n        // Apply caustics to color\n        vec3 causticColor = mix(waterColor, uColorHighlight, caustic * uCausticIntensity);\n        \n        // Apply fresnel\n        causticColor = mix(causticColor, uColorHighlight, fresnel * 0.2);\n        \n        // Final color with foam edges\n        vec3 finalColor = mix(causticColor, uColorHighlight, (1.0 - edge) * 0.15);\n        \n        // Output final color with opacity\n        gl_FragColor = vec4(finalColor, uOpacity);\n      }\n    "
        };
    }, [
        uniforms
    ]);
    // Make update method available to parent components via ref
    useImperativeHandle(ref, function() {
        return {
            update: function(time) {
                if (materialRef.current) {
                    materialRef.current.uniforms.uTime.value = time;
                }
            }
        };
    });
    // Cleanup
    useEffect(function() {
        return function() {
            if (geometry) geometry.dispose();
        };
    }, [
        geometry
    ]);
    return /*#__PURE__*/ _jsxDEV("mesh", {
        ref: meshRef,
        position: [
            position[0],
            position[1] + height,
            position[2]
        ],
        rotation: [
            -Math.PI / 2,
            0,
            0
        ],
        renderOrder: 10,
        children: [
            /*#__PURE__*/ _jsxDEV("primitive", {
                object: geometry,
                attach: "geometry"
            }, void 0, false, {
                fileName: "WaterSurfaceFallback.jsx",
                lineNumber: 217,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("shaderMaterial", {
                ref: materialRef,
                args: [
                    waterShader
                ],
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            }, void 0, false, {
                fileName: "WaterSurfaceFallback.jsx",
                lineNumber: 218,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "WaterSurfaceFallback.jsx",
        lineNumber: 211,
        columnNumber: 5
    }, _this);
});
