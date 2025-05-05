import * as THREE from 'three';
/**
 * Returns a Group containing a flat sand floor plus a few random “dune” mounds.
 */ export function createSandGroup() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref_tankWidth = _ref.tankWidth, tankWidth = _ref_tankWidth === void 0 ? 20 : _ref_tankWidth, _ref_tankDepth = _ref.tankDepth, tankDepth = _ref_tankDepth === void 0 ? 20 : _ref_tankDepth, _ref_tankHeight = _ref.tankHeight, tankHeight = _ref_tankHeight === void 0 ? 6.0 : _ref_tankHeight, _ref_moundCount = _ref.moundCount, moundCount = _ref_moundCount === void 0 ? 6 : _ref_moundCount, _ref_sandColor = _ref.sandColor, sandColor = _ref_sandColor === void 0 ? 0xFAF0E6 : _ref_sandColor, _ref_wallThickness = _ref.wallThickness, wallThickness = _ref_wallThickness === void 0 ? 0.1 // Added wallThickness to calculation
     : _ref_wallThickness;
    var FLOOR_Y = -tankHeight * 0.5;
    var group = new THREE.Group();
    // ── flat floor ────────────────────────────────────────────────
    var floorGeo = new THREE.PlaneGeometry(tankWidth, tankDepth);
    var floorMat = new THREE.MeshStandardMaterial({
        color: sandColor,
        roughness: 1,
        side: THREE.DoubleSide // Make it visible from below
    });
    var floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    // Raise floor slightly to meet bottom of glass walls (physics floor top is at -2.90)
    // FLOOR_Y is -3.0, wallThickness is 0.1.
    // Add a tiny epsilon to prevent z-fighting/clipping with the physics floor collider top surface.
    var epsilon = 0.001;
    floor.position.y = FLOOR_Y + wallThickness + epsilon; // -3.0 + 0.1 + 0.001 = -2.899
    floor.receiveShadow = true;
    floor.name = 'SandFloor';
    group.add(floor);
    // ── procedural mounds ─────────────────────────────────────────
    for(var i = 0; i < moundCount; i++){
        var r = THREE.MathUtils.randFloat(1.4, 3); // Original radius
        var geo = new THREE.SphereGeometry(r, 20, 20);
        // --- Flatten the bottom vertices ---
        var positions = geo.attributes.position;
        var vertex = new THREE.Vector3();
        var flattenFactor = 0.1; // Adjust this (0 to 1) for more/less flattening. 0 = perfectly flat base.
        for(var i1 = 0; i1 < positions.count; i1++){
            vertex.fromBufferAttribute(positions, i1);
            // If the vertex is in the bottom half of the original sphere
            if (vertex.y < 0) {
                // Scale its y-coordinate towards 0, effectively flattening the bottom
                vertex.y *= flattenFactor;
                positions.setY(i1, vertex.y);
            }
        }
        positions.needsUpdate = true; // Important: Tell Three.js the geometry changed
        // --- Squash the dune AFTER flattening ---
        var verticalScale = 0.35;
        geo.scale(1, verticalScale, 1);
        // --- Material ---
        var hueShift = THREE.MathUtils.randFloatSpread(0.02); // Reduce hue variation for off-white
        var col = new THREE.Color(sandColor).offsetHSL(hueShift, 0, THREE.MathUtils.randFloat(-0.03, 0.03)); // Reduce lightness variation slightly
        var mat = new THREE.MeshStandardMaterial({
            color: col,
            roughness: 1,
            side: THREE.DoubleSide // Make mounds double-sided too
        });
        var mound = new THREE.Mesh(geo, mat);
        // --- Positioning ---
        // Place the center so the flattened bottom rests near the floor level
        // Bottom Y relative to center after flattening and scaling: -r * flattenFactor * verticalScale
        var bottomOffset = r * flattenFactor * verticalScale;
        mound.position.set(THREE.MathUtils.randFloatSpread((tankWidth - r * 2) * 0.8), // Adjust mound Y position based on the new floor height offset, including epsilon
        FLOOR_Y + bottomOffset + wallThickness + epsilon, THREE.MathUtils.randFloatSpread((tankDepth - r * 2) * 0.8) // Random Z
        );
        mound.receiveShadow = mound.castShadow = true;
        mound.name = "SandMound_".concat(i);
        group.add(mound);
    }
    group.name = 'SandGroup';
    return group;
}
