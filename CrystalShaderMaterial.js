import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
// Basic uniforms - time for animation, color, etc.
var uniforms = {
    time: 0,
    color: new THREE.Color(0x66ffcc),
    emissive: new THREE.Color(0x228872),
    intensity: 1.5,
    glowColor: new THREE.Color(0x88ffff),
    fresnelPower: 2.5,
    shimmerFrequency: 15.0,
    shimmerAmplitude: 0.15
};
// Simple vertex shader - passes position and normal
var vertexShader = "\n  uniform float time;\n  varying vec3 vNormal;\n  varying vec3 vPosition; // Pass local position\n  varying mat4 vModelMatrix; // Pass model matrix\n  void main() {\n    vNormal = normalize(normalMatrix * normal);\n    vPosition = position; // Pass local position to fragment shader\n    vModelMatrix = modelMatrix; // Pass model matrix for world position calculation\n    // Optional: Add some vertex displacement animation\n    vec3 pos = position;\n    // Example: pos.y += sin(time * 2.0 + position.x * 5.0) * 0.05;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n  }\n";
// Simple fragment shader - basic lighting and color
var fragmentShader = "\n  uniform float time;\n  uniform vec3 color;\n  uniform vec3 emissive;\n  uniform float intensity;\n  uniform vec3 glowColor; // Added uniform\n  uniform float fresnelPower; // Added uniform\n  uniform float shimmerFrequency; // Added uniform\n  uniform float shimmerAmplitude; // Added uniform\n  varying vec3 vNormal;\n  varying vec3 vPosition; // World position not passed by default, need to calculate\n  // Simple noise function (replace with a better one if needed)\n  float random (vec2 st) {\n    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n  }\n  void main() {\n    // Use local position; avoids missing modelMatrix uniform on some drivers\n    vec3 worldPosition = vPosition;\n    vec3 viewDir  = normalize(cameraPosition - worldPosition);\n    vec3 normal   = normalize(vNormal);\n    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), fresnelPower);\n    // Shimmer effect using time and position/normal\n    float shimmer = sin(time * shimmerFrequency + worldPosition.y * 5.0 + random(worldPosition.xy) * 2.0) * shimmerAmplitude + (1.0 - shimmerAmplitude);\n    shimmer = smoothstep(0.0, 1.0, shimmer); // Keep it positive\n    // Combine base color, emissive, fresnel glow, and shimmer\n    vec3 base = color + emissive * intensity * 0.5; // Reduce direct emissive contribution slightly\n    vec3 glow = glowColor * fresnel * intensity * shimmer; // Modulate glow by shimmer and intensity\n    vec3 finalColor = base + glow;\n    // Add a subtle core glow that isn't affected by fresnel as much\n    finalColor += emissive * intensity * 0.2 * shimmer;\n    gl_FragColor = vec4(finalColor, fresnel + 0.1); // Use fresnel for alpha to make edges slightly more transparent (optional)\n    //gl_FragColor = vec4(finalColor, 1.0); // Or keep opaque\n  }\n";
// Create the shader material using drei's helper
var CrystalMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);
// Extend R3F to recognize the material
extend({
    CrystalMaterial: CrystalMaterial
});
// Export for use in components
export { CrystalMaterial };
