import * as THREE from 'three';
// Placeholder: Replace with your actual coral geometry and material
var geometry = new THREE.IcosahedronGeometry(0.2, 0); // Simple shape
geometry.translate(0, 0.15, 0); // Pivot near the bottom
var material = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    roughness: 0.6
}); // Orangey-red color
var coralPrefab = new THREE.Mesh(geometry, material);
export default coralPrefab;
