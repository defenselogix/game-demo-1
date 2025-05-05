import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
// A simple particle burst effect for when bubbles pop
export function BubblePopEffect(param) {
    var position = param.position, size = param.size, onComplete = param.onComplete;
    var particlesRef = useRef();
    var particleCount = 8; // Number of particles in the burst
    // Particle system setup
    var particles = useMemo(function() {
        return Array.from({
            length: particleCount
        }).map(function() {
            return {
                // Random direction for each particle
                direction: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2).normalize(),
                speed: 0.1 + Math.random() * 0.2,
                size: size * (0.2 + Math.random() * 0.3),
                life: 0,
                maxLife: 0.5 + Math.random() * 0.5
            };
        });
    }, [
        size
    ]);
    // Matrices for instanced mesh
    var matrices = useMemo(function() {
        return Array.from({
            length: particleCount
        }).map(function() {
            return new THREE.Matrix4();
        });
    }, []);
    var tempObj = useMemo(function() {
        return new THREE.Object3D();
    }, []);
    var effectActive = useRef(true);
    useFrame(function(state, delta) {
        if (!particlesRef.current || !effectActive.current) return;
        var allCompleted = true;
        particles.forEach(function(particle, i) {
            // Update particle life
            particle.life += delta;
            if (particle.life < particle.maxLife) {
                allCompleted = false;
                // Move particle outward in its direction
                tempObj.position.set(position.x + particle.direction.x * particle.life * particle.speed, position.y + particle.direction.y * particle.life * particle.speed, position.z + particle.direction.z * particle.life * particle.speed);
                // Fade out the particle based on its life
                var lifeRatio = particle.life / particle.maxLife;
                var scale = particle.size * (1 - lifeRatio);
                tempObj.scale.set(scale, scale, scale);
                tempObj.updateMatrix();
                matrices[i].copy(tempObj.matrix);
            } else {
                // Hide the particle if it's completed its lifetime
                tempObj.scale.set(0, 0, 0);
                tempObj.updateMatrix();
                matrices[i].copy(tempObj.matrix);
            }
        });
        if (allCompleted && effectActive.current) {
            effectActive.current = false;
            if (onComplete) onComplete();
        }
        // Update all matrices
        matrices.forEach(function(matrix, i) {
            particlesRef.current.setMatrixAt(i, matrix);
        });
        particlesRef.current.instanceMatrix.needsUpdate = true;
    });
    return /*#__PURE__*/ _jsxDEV("instancedMesh", {
        ref: particlesRef,
        args: [
            null,
            null,
            particleCount
        ],
        children: [
            /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                args: [
                    1,
                    8,
                    8
                ]
            }, void 0, false, {
                fileName: "BubblePopEffect.jsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("meshBasicMaterial", {
                color: "#ffffff",
                transparent: true,
                opacity: 0.7
            }, void 0, false, {
                fileName: "BubblePopEffect.jsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "BubblePopEffect.jsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
