import { ShaderMaterial, Color, RepeatWrapping, Vector2 } from 'three';
/**
 * Creates a ShaderMaterial for a realistic, pearl-white sand seabed
 * with subtle noise and shimmer effects.
 * @returns {THREE.ShaderMaterial} The seabed material.
 */ export function createSeabedMaterial() {
    var sandMaterial = new ShaderMaterial({
        uniforms: {
            uTime: {
                value: 0.0
            },
            uColorBase: {
                value: new Color(0xf0ead6)
            },
            uColorDark: {
                value: new Color(0xd2b48c)
            },
            uResolution: {
                value: new Vector2(window.innerWidth, window.innerHeight)
            },
            uTextureRepeat: {
                value: new Vector2(8.0, 8.0)
            } // How many times the noise pattern repeats
        },
        vertexShader: "\n      varying vec2 vUv;\n      varying vec3 vNormal;\n      varying vec3 vWorldPosition;\n      void main() {\n        vUv = uv;\n        vNormal = normalize(normalMatrix * normal);\n        vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n        vWorldPosition = worldPosition.xyz;\n        gl_Position = projectionMatrix * viewMatrix * worldPosition;\n      }\n    ",
        fragmentShader: "\n      uniform float uTime;\n      uniform vec3 uColorBase;\n      uniform vec3 uColorDark;\n      uniform vec2 uResolution; // Not strictly needed here but good practice\n      uniform vec2 uTextureRepeat;\n      varying vec2 vUv;\n      varying vec3 vNormal;\n      varying vec3 vWorldPosition; // Use world position for stable noise\n      // Psuedo-random number generator (simplistic)\n      float rand(vec2 co){\n          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n      }\n      // Simple value noise function\n      float noise(vec2 st) {\n          vec2 i = floor(st);\n          vec2 f = fract(st);\n          float a = rand(i);\n          float b = rand(i + vec2(1.0, 0.0));\n          float c = rand(i + vec2(0.0, 1.0));\n          float d = rand(i + vec2(1.0, 1.0));\n          vec2 u = f * f * (3.0 - 2.0 * f); // Smoothstep interpolation\n          return mix(a, b, u.x) +\n                 (c - a)* u.y * (1.0 - u.x) +\n                 (d - b) * u.x * u.y;\n      }\n      // Fractional Brownian Motion (fBm) for more detailed noise\n      float fbm(vec2 st) {\n          float value = 0.0;\n          float amplitude = 0.5;\n          float frequency = 0.0; // Frequency starts low\n          for (int i = 0; i < 4; i++) { // 4 octaves of noise\n              value += amplitude * noise(st);\n              st *= 2.0; // Double frequency\n              amplitude *= 0.5; // Halve amplitude\n          }\n          return value;\n      }\n      void main() {\n        // Use world position projected onto XZ plane for stable noise pattern\n        // Scale by uTextureRepeat to control pattern density\n        vec2 noiseCoord = vWorldPosition.xz * uTextureRepeat * 0.1; // Scale down for larger patterns\n        // Base noise pattern for color variation\n        float n = fbm(noiseCoord + uTime * 0.01); // Slow animation\n        // Mix base color and darker color based on noise\n        vec3 color = mix(uColorBase, uColorDark, smoothstep(0.4, 0.6, n)); // Smooth transition\n        // Subtle shimmer effect based on view angle and noise\n        vec3 viewDir = normalize(cameraPosition - vWorldPosition);\n        float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0); // Fresnel-like effect\n        float shimmerNoise = noise(noiseCoord * 3.0 + uTime * 0.1); // Faster, smaller noise for shimmer\n        float shimmer = smoothstep(0.6, 0.8, shimmerNoise) * fresnel * 0.3; // Control shimmer intensity\n        // Add shimmer (additive, subtle white highlights)\n        color += vec3(shimmer);\n        // Basic lighting influence (optional, can be enhanced)\n        float lightIntensity = max(dot(vNormal, normalize(vec3(1.0, 1.0, 0.5))), 0.2); // Simple directional light assumption\n        color *= lightIntensity;\n        gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0); // Clamp color and set alpha\n      }\n    ",
        // side: THREE.DoubleSide, // Optional: if needed
        transparent: false
    });
    // Set texture wrapping if using textures (not in this shader)
    // sandMaterial.uniforms.uTexture.value.wrapS = RepeatWrapping;
    // sandMaterial.uniforms.uTexture.value.wrapT = RepeatWrapping;
    return sandMaterial;
}
