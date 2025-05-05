import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo, useRef, useEffect, createRef } from 'react';
import * as THREE from 'three';
import { Physics, RigidBody, Heightfield, CuboidCollider } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber'; // Import useFrame for potential debug animations later
import SandMoundPhysics from './SandMoundPhysics.js'; // Import the sand mound physics component
// Reordered imports: Constants/Helpers first
import { TANK_DIMENSIONS } from './utilsTankConstants.js'; // Import correct tank dimensions object
import { placeOnFloor } from './utilsHelpers.js'; // Import placement helper
// Then import components
import FishSchool from './FishSchool.js'; // Import FishSchool directly (default export)
// Removed direct Coral import
import { CoralSpawner } from 'CoralSpawner'; // Import the CoralSpawner
import { Seaweed } from 'componentsSeaweed'; // Update path if necessary
export default function PhysicsContent() {
    // Removed useRapier hook and worldRef
    // Removed memoization and effects related to manual Coral placement
    // Removed staticObjects, coralRefs, and the useEffect for placing corals
    // Removed useFrame logic as Physics component handles stepping
    // Render the actual content
    return /*#__PURE__*/ _jsxDEV(Physics, {
        gravity: [
            0,
            -9.81,
            0
        ],
        children: [
            /*#__PURE__*/ _jsxDEV(TankBoundary, {}, void 0, false, {
                fileName: "PhysicsContent.jsx",
                lineNumber: 24,
                columnNumber: 3
            }, this),
            /*#__PURE__*/ _jsxDEV(SandMound, {}, void 0, false, {
                fileName: "PhysicsContent.jsx",
                lineNumber: 27,
                columnNumber: 3
            }, this),
            /*#__PURE__*/ _jsxDEV("group", {
                children: [
                    (TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : TANK_DIMENSIONS.innerWidth) && (TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : TANK_DIMENSIONS.innerDepth) && (TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : TANK_DIMENSIONS.maxY) && (TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : TANK_DIMENSIONS.minY) && /*#__PURE__*/ _jsxDEV(FishSchool, {
                        count: 15,
                        bounds: {
                            width: TANK_DIMENSIONS.innerWidth,
                            height: TANK_DIMENSIONS.maxY - TANK_DIMENSIONS.minY,
                            depth: TANK_DIMENSIONS.innerDepth
                        }
                    }, void 0, false, {
                        fileName: "PhysicsContent.jsx",
                        lineNumber: 31,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ _jsxDEV(CoralSpawner, {
                        count: 15
                    }, void 0, false, {
                        fileName: "PhysicsContent.jsx",
                        lineNumber: 38,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "PhysicsContent.jsx",
                lineNumber: 28,
                columnNumber: 3
            }, this)
        ]
    }, void 0, true, {
        fileName: "PhysicsContent.jsx",
        lineNumber: 21,
        columnNumber: 1
    }, this);
}
// Component to manage sand mound geometry creation and physics integration
function SandMound() {
    // Parameters for the mound
    var numRows = 30;
    var numCols = 30;
    var moundHeight = 1.5;
    var moundWidth = 4;
    // Generate height data (same logic as before)
    var heights = useMemo(function() {
        var hf = [];
        var simpleNoise = function(x, z) {
            var scale = 5.0;
            var amplitude = 0.3;
            return (Math.sin(x * scale) * Math.cos(z * scale * 1.5) + Math.sin(z * scale * 0.8) * Math.cos(x * scale * 1.2)) * amplitude;
        };
        for(var i = 0; i < numRows; i++){
            for(var j = 0; j < numCols; j++){
                var u = j / (numCols - 1);
                var v = i / (numRows - 1);
                var x = (u - 0.5) * 2;
                var z = (v - 0.5) * 2;
                var dist = Math.sqrt(x * x + z * z);
                var baseHeight = dist < 1 ? Math.cos(dist * Math.PI * 0.5) * moundHeight : 0;
                var noiseVal = simpleNoise(x, z);
                var height = baseHeight + noiseVal * baseHeight;
                hf.push(Math.max(0, height));
            }
        }
        return hf;
    }, [
        numRows,
        numCols,
        moundHeight
    ]);
    // Calculate scale based on desired width/depth
    var scale = useMemo(function() {
        return new THREE.Vector3(moundWidth, 1, moundWidth);
    }, [
        moundWidth
    ]);
    // Determine position (center of tank floor)
    var position = useMemo(function() {
        var _TANK_DIMENSIONS_center, _TANK_DIMENSIONS_center1;
        var _TANK_DIMENSIONS_center_x, _TANK_DIMENSIONS_minY, _TANK_DIMENSIONS_center_z;
        return [
            (_TANK_DIMENSIONS_center_x = TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : (_TANK_DIMENSIONS_center = TANK_DIMENSIONS.center) === null || _TANK_DIMENSIONS_center === void 0 ? void 0 : _TANK_DIMENSIONS_center.x) !== null && _TANK_DIMENSIONS_center_x !== void 0 ? _TANK_DIMENSIONS_center_x : 0,
            (_TANK_DIMENSIONS_minY = TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : TANK_DIMENSIONS.minY) !== null && _TANK_DIMENSIONS_minY !== void 0 ? _TANK_DIMENSIONS_minY : 0,
            (_TANK_DIMENSIONS_center_z = TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : (_TANK_DIMENSIONS_center1 = TANK_DIMENSIONS.center) === null || _TANK_DIMENSIONS_center1 === void 0 ? void 0 : _TANK_DIMENSIONS_center1.z) !== null && _TANK_DIMENSIONS_center_z !== void 0 ? _TANK_DIMENSIONS_center_z : 0
        ];
    }, [
        TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : TANK_DIMENSIONS.center,
        TANK_DIMENSIONS === null || TANK_DIMENSIONS === void 0 ? void 0 : TANK_DIMENSIONS.minY
    ]);
    // Create geometry for the SandMoundPhysics component
    var moundGeometry = useMemo(function() {
        var geom = new THREE.PlaneGeometry(scale.x, scale.z, numCols - 1, numRows - 1);
        var posAttr = geom.attributes.position;
        for(var i = 0; i < posAttr.count; i++){
            var row = Math.floor(i / numCols);
            var col = i % numCols;
            var heightIndex = row * numCols + col;
            // Set Y coordinate (world up) based on height data
            posAttr.setY(i, heights[heightIndex] * scale.y);
        }
        geom.computeVertexNormals();
        // PlaneGeometry is XZ by default when rotated is unnecessary
        // geom.rotateX(-Math.PI / 2); // Rotation removed, Plane is XZ initially
        return geom;
    }, [
        heights,
        numRows,
        numCols,
        scale
    ]);
    // Simple material for the mound (can be replaced with a proper sand material later)
    var moundMaterial = useMemo(function() {
        return new THREE.MeshStandardMaterial({
            color: '#C2B280',
            roughness: 0.8,
            metalness: 0.1
        });
    }, []);
    return /*#__PURE__*/ _jsxDEV(SandMoundPhysics, {
        geometry: moundGeometry,
        material: moundMaterial,
        position: position
    }, void 0, false, {
        fileName: "PhysicsContent.jsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
// Component to define the physical boundaries of the tank
function TankBoundary() {
    var center = TANK_DIMENSIONS.center, size = TANK_DIMENSIONS.size, wallThickness = TANK_DIMENSIONS.wallThickness;
    var wallHeight = size.y; // Use the full tank height for walls
    // Floor
    var floorSize = [
        size.x / 2,
        wallThickness / 2,
        size.z / 2
    ]; // half-extents
    var floorPos = [
        center.x,
        center.y - size.y / 2 - wallThickness / 2,
        center.z
    ]; // Positioned below minY
    // Walls (half-extents)
    var wallXSize = [
        wallThickness / 2,
        wallHeight / 2,
        size.z / 2
    ];
    var wallZSize = [
        size.x / 2,
        wallHeight / 2,
        wallThickness / 2
    ];
    // Wall Positions
    var wallPosX = center.x + size.x / 2 + wallThickness / 2;
    var wallNegX = center.x - size.x / 2 - wallThickness / 2;
    var wallPosZ = center.z + size.z / 2 + wallThickness / 2;
    var wallNegZ = center.z - size.z / 2 - wallThickness / 2;
    return /*#__PURE__*/ _jsxDEV(RigidBody, {
        type: "fixed",
        colliders: false,
        userData: {
            type: 'tankBoundary'
        },
        children: [
            /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                args: floorSize,
                position: floorPos
            }, void 0, false, {
                fileName: "PhysicsContent.jsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                args: wallXSize,
                position: [
                    wallNegX,
                    center.y,
                    center.z
                ]
            }, void 0, false, {
                fileName: "PhysicsContent.jsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                args: wallXSize,
                position: [
                    wallPosX,
                    center.y,
                    center.z
                ]
            }, void 0, false, {
                fileName: "PhysicsContent.jsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                args: wallZSize,
                position: [
                    center.x,
                    center.y,
                    wallNegZ
                ]
            }, void 0, false, {
                fileName: "PhysicsContent.jsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                args: wallZSize,
                position: [
                    center.x,
                    center.y,
                    wallPosZ
                ]
            }, void 0, false, {
                fileName: "PhysicsContent.jsx",
                lineNumber: 141,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "PhysicsContent.jsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
