import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
// Uniforms for customization and animation
var uniforms = {
    time: 0,
    // Ring Effect Colors & Params
    baseColor: new THREE.Color(0x007722),
    lineColor: new THREE.Color(0x003311),
    lineFrequency: 12.0,
    lineSpeed: 0.4,
    lineThickness: 0.2,
    pulseIntensity: 0.2,
    pulseSpeed: 2.0,
    // Sway effect (kept from previous)
    waveAmplitude: 0.15,
    swayFrequency: 0.25
};
// Vertex shader: Displaces vertices based on height and time
var vertexShader = "\n  uniform float time;\n  // Removed waveFrequency (not used in this simplified sway)\n  uniform float waveAmplitude;\n  uniform float swayFrequency;\n  varying vec2 vUv;\n  varying float vWave; // Pass wave factor to fragment shader\n  void main() {\n    vUv = uv;\n    vec3 pos = position;\n    // Sway factor based primarily on time and a bit by height for variation\n    float heightFactor = uv.y; // 0 at base, 1 at tip\n    float swayPhase = time * swayFrequency + heightFactor * 0.5; // Add slight height-based phase offset\n    float swayAmount = sin(swayPhase) * waveAmplitude * (heightFactor * 0.8 + 0.2); // Increase sway towards tip\n    // Apply sway mainly on X, less on Z for a flatter feel\n    pos.x += swayAmount;\n    pos.z += swayAmount * 0.3; // Less Z displacement\n    vWave = sin(swayPhase); // Pass wave factor (sine value)\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n  }\n";
// Fragment shader: Applies matrix code effect
var fragmentShader = "\n  // Ring effect uniforms\nuniform vec3 baseColor; // Dark green background\nuniform vec3 lineColor; // Black scrolling lines\nuniform float lineFrequency;\nuniform float lineSpeed;\nuniform float lineThickness;\nuniform float pulseIntensity;\nuniform float pulseSpeed;\n  uniform float time;\n  varying vec2 vUv;\n  // varying float vWave; // Sway factor - can be reintroduced if needed later\n  // Simple pseudo-random noise function using sin/fract\n  float noise(vec2 st) {\n    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n  }\n  // Smoothed noise function (similar to value noise)\n  float smoothedNoise(vec2 st) {\n    vec2 i = floor(st);\n    vec2 f = fract(st);\n    // Smoothstep interpolation\n    vec2 u = f * f * (3.0 - 2.0 * f);\n    float a = noise(i);\n    float b = noise(i + vec2(1.0, 0.0));\n    float c = noise(i + vec2(0.0, 1.0));\n    float d = noise(i + vec2(1.0, 1.0));\n    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n  }\n  // Fractal Brownian Motion (fbm) - layering noise\n  float fbm(vec2 st) {\n    float value = 0.0;\n    float amplitude = 0.5;\n    // Corrected loop structure for fbm\n    for (int i = 0; i < 4; i++) { // Use a fixed number of octaves (e.g., 4)\n        value += amplitude * smoothedNoise(st);\n        st *= 2.0; // Double frequency each octave (can adjust complexity relation if needed)\n        amplitude *= 0.5; // Halve amplitude each octave\n    }\n    return value;\n  }\n  void main() {\n// --- Matrix Code Effect ---\n// 1. Scrolling Pattern\nfloat lineScroll = vUv.y * lineFrequency - time * lineSpeed; // Vertical scroll based on UV.y and time\nfloat linePattern = fract(lineScroll); // Repeating pattern (0 to 1)\n// Add some horizontal variation using noise based on x coordinate and scrolled y\nfloat noiseCoordX = vUv.x * 5.0; // Scale noise lookup horizontally\nfloat noiseCoordY = floor(lineScroll); // Use integer part of scroll for stable noise per line segment\nfloat randomOffset = smoothedNoise(vec2(noiseCoordX, noiseCoordY)) * 0.5; // Apply horizontal noise shift per line\nlinePattern = fract(lineScroll + randomOffset); // Add noise offset to pattern\n// 2. Line Shape (using thickness) - Soften the edges\nfloat edgeSoftness = 0.05; // Increase fade gradient width\nfloat thicknessThreshold = lineThickness * 0.5;\nfloat lineShape = smoothstep(0.0, thicknessThreshold + edgeSoftness, linePattern) - smoothstep(1.0 - thicknessThreshold - edgeSoftness, 1.0, linePattern);\nlineShape = clamp(lineShape, 0.0, 1.0);\n// 3. Reintroduce Pulsing Visibility (subtly)\nfloat visibilityPulse = (sin(time * pulseSpeed + lineScroll * 0.2) + 1.0) * 0.5; // Base sine wave (0 to 1)\nvisibilityPulse = 1.0 - pulseIntensity + visibilityPulse * pulseIntensity; // Apply intensity control\n// Optional: Add subtle noise to the pulse for less uniformity\n// float pulseNoise = noise(vec2(vUv.x * 10.0, noiseCoordY));\n// float randomPulseFactor = mix(0.8, 1.0, pulseNoise); // Modulate pulse slightly\n// visibilityPulse *= randomPulseFactor;\nvisibilityPulse = clamp(visibilityPulse, 0.0, 1.0); // Ensure it stays in valid range\n// 4. Combine (with pulsing visibility)\n// Mix between baseColor and lineColor based on lineShape, modulated by visibilityPulse\nvec3 finalColor = mix(baseColor, lineColor, lineShape * visibilityPulse);\n// Optional: Fade towards base (optional) - keeping this can look nice\nfloat baseFade = smoothstep(0.0, 0.1, vUv.y);\nfinalColor = mix(baseColor, finalColor, baseFade);\ngl_FragColor = vec4(finalColor, 1.0);\n  }\n";
// Create the material using drei helper
var SeaweedMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);
// Extend R3F
extend({
    SeaweedMaterial: SeaweedMaterial
});
// Export
export { SeaweedMaterial };
