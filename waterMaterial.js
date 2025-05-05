import * as THREE from 'three';
// Water Material using standard material for now
// Future: Could use a shader for more advanced effects (refraction, caustics)
export function createWaterMaterial() {
    return new THREE.MeshPhysicalMaterial({
        color: 0x6495ED,
        metalness: 0.1,
        roughness: 0.01,
        transmission: 0.95,
        thickness: 0,
        ior: 1.05,
        transparent: true,
        opacity: 0.8,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false // Disable depth writing for water, consistent with glass for better transparency sorting
    });
}
