import * as THREE from 'three';
import { getSurfacePoint } from './getSurfacePoint.js';
// Removed placePrefabOnSurface import as it's not used in this file anymore
import { SeaweedMaterial } from './SeaweedShaderMaterial.js';
// --- Constants for Kelp Geometry ---
export var KELP_BASE_HEIGHT = 1.8; // Slightly shorter base height
export var HEIGHT_VARIATION = 0.9; // Increased variation
// STIPE constants removed, we'll generate ribbons directly
var RIBBON_WIDTH = 0.35; // Narrower ribbons
var RIBBON_SEGMENTS = 24; // Increased segments significantly for very smooth curves
// BLADE constants removed as we only generate ribbons
/**
 * Creates a BufferGeometry resembling a single wavy kelp ribbon.
 */ export function createKelpGeometry(height) {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];
    var uvs = [];
    var indices = [];
    var vertexIndex = 0; // Use a simple counter for vertex indices
    // --- Create Ribbon ---
    var ribbonHeight = height; // Use the passed height
    var initialAngleX = Math.random() * Math.PI * 0.2 - Math.PI * 0.1; // Slight initial tilt X
    var initialAngleZ = Math.random() * Math.PI * 0.2 - Math.PI * 0.1; // Slight initial tilt Z
    // Parameters for gentler, more natural S-curves
    var waveFrequencyX = Math.random() * 0.6 + 0.5; // Lower frequency
    var waveFrequencyZ = Math.random() * 0.6 + 0.5;
    var waveAmplitudeX = RIBBON_WIDTH * (Math.random() * 0.6 + 0.4); // Adjusted amplitude
    var waveAmplitudeZ = RIBBON_WIDTH * (Math.random() * 0.6 + 0.4);
    // Tapering parameters for a very sharp point
    var taperStartRatio = 0.3; // Start tapering later
    var taperPower = 3.5; // Stronger taper curve
    for(var i = 0; i <= RIBBON_SEGMENTS; i++){
        var segmentRatio = i / RIBBON_SEGMENTS;
        var y = segmentRatio * ribbonHeight;
        var v = segmentRatio; // UV mapping (V goes from 0 at base to 1 at tip)
        // Smoother easing for wave amplitude increase towards the tip
        var amplitudeMultiplier = Math.pow(segmentRatio, 0.7) * 0.7 + 0.3; // Smoother ramp-up
        // Calculate S-curve displacement with phase offsets for more natural movement
        var wavePhaseOffsetX = Math.PI * 0.3; // Introduce phase difference
        var waveOffsetX = Math.sin(segmentRatio * Math.PI * waveFrequencyX + initialAngleX) * waveAmplitudeX * amplitudeMultiplier;
        var waveOffsetZ = Math.cos(segmentRatio * Math.PI * waveFrequencyZ + initialAngleZ + wavePhaseOffsetX) * waveAmplitudeZ * amplitudeMultiplier; // Use cosine for Z, add phase offset
        // Calculate tapering - start later and apply more aggressively near the tip
        var currentWidth = RIBBON_WIDTH;
        if (segmentRatio > taperStartRatio) {
            var taperRatio = (segmentRatio - taperStartRatio) / (1.0 - taperStartRatio);
            var taper = Math.pow(1.0 - taperRatio, taperPower);
            currentWidth = RIBBON_WIDTH * Math.max(0.005, taper); // Ensure width doesn't go below a tiny minimum
        }
        // Calculate vertex positions
        // Add slight twist based on height
        var twistAngle = segmentRatio * Math.PI * 0.1; // Gentle twist
        var cosTwist = Math.cos(twistAngle);
        var sinTwist = Math.sin(twistAngle);
        var halfWidth = currentWidth / 2;
        var baseX = waveOffsetX; // Centerline offset
        var baseZ = waveOffsetZ;
        // Rotate the width vector around the Y-axis by twistAngle
        var rotatedHalfWidthX = halfWidth * cosTwist;
        var rotatedHalfWidthZ = halfWidth * sinTwist;
        var leftX = baseX - rotatedHalfWidthX;
        var leftZ = baseZ - rotatedHalfWidthZ;
        var rightX = baseX + rotatedHalfWidthX;
        var rightZ = baseZ + rotatedHalfWidthZ;
        // Left vertex
        vertices.push(leftX, y, leftZ);
        uvs.push(0, v); // U = 0 for left edge
        var leftVertexIdx = vertexIndex;
        vertexIndex++;
        // Right vertex
        vertices.push(rightX, y, rightZ);
        uvs.push(1, v); // U = 1 for right edge
        var rightVertexIdx = vertexIndex;
        vertexIndex++;
        // Add indices for the segment faces
        if (i > 0) {
            var prevLeft = leftVertexIdx - 2;
            var prevRight = rightVertexIdx - 2; // Corrected index
            var currLeft = leftVertexIdx;
            var currRight = rightVertexIdx;
            // Triangle 1: PrevLeft -> PrevRight -> CurrLeft
            indices.push(prevLeft, prevRight, currLeft);
            // Triangle 2: PrevRight -> CurrRight -> CurrLeft
            indices.push(prevRight, currRight, currLeft);
        }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals(); // Important for lighting
    return geometry;
}
/*
 * Calculates placement data for `count` kelp plants around `center`.
 */ export function calculateKelpPlacement(param) {
    var scene = param.scene, center = param.center, _param_radius = param.radius, radius = _param_radius === void 0 ? 2.0 : _param_radius, _param_count = param.count, count = _param_count === void 0 ? 30 : _param_count;
    var down = new THREE.Vector3(0, -1, 0);
    var kelpData = []; // Array to store placement data
    var tempQuaternion = new THREE.Quaternion();
    var defaultUp = new THREE.Vector3(0, 1, 0);
    for(var i = 0; i < count; i++){
        // Generate random height
        var randomHeight = KELP_BASE_HEIGHT + Math.random() * HEIGHT_VARIATION * 2 - HEIGHT_VARIATION;
        var height = Math.max(0.8, randomHeight); // Ensure min height (slightly reduced min)
        // 1️⃣ Random disc sample above target area
        var a = Math.random() * Math.PI * 2;
        var r = Math.sqrt(Math.random()) * radius;
        var samplePos = center.clone().add(new THREE.Vector3(Math.cos(a) * r, 10, Math.sin(a) * r)); // Start raycast high up
        // 2️⃣ Mesh-accurate height + normal via raycast
        var hit = getSurfacePoint(scene, samplePos, down);
        if (!hit) continue; // Skip if raycast misses
        // 3️⃣ Calculate rotation quaternion from surface normal
        tempQuaternion.setFromUnitVectors(defaultUp, hit.normal);
        // Store data for this kelp instance
        kelpData.push({
            id: "kelp-".concat(i),
            position: hit.point,
            rotation: tempQuaternion.clone(),
            height: height
        });
    }
    // Return the array of data objects
    return kelpData;
}
