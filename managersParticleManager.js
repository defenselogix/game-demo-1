function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
import * as THREE from 'three';
var PARTICLE_COUNT = 50; // Number of particles per burst
var PARTICLE_SPEED = 1.5; // Base speed
var PARTICLE_LIFETIME = 0.6; // Seconds
var PARTICLE_SIZE = 0.08; // Size of each particle point
var ParticleBurst = /*#__PURE__*/ function() {
    "use strict";
    function ParticleBurst(scene, position, color) {
        _class_call_check(this, ParticleBurst);
        this.scene = scene;
        this.lifetime = PARTICLE_LIFETIME;
        this.velocities = [];
        var pointsGeometry = new THREE.BufferGeometry();
        var positions = new Float32Array(PARTICLE_COUNT * 3);
        var colors = new Float32Array(PARTICLE_COUNT * 3);
        var baseColor = new THREE.Color(color);
        for(var i = 0; i < PARTICLE_COUNT; i++){
            // Initial position is the burst origin
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
            // Random velocity vector
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(Math.random() * 2 - 1);
            var speed = Math.random() * PARTICLE_SPEED;
            this.velocities.push(new THREE.Vector3(speed * Math.sin(phi) * Math.cos(theta), speed * Math.sin(phi) * Math.sin(theta), speed * Math.cos(phi)));
            // Set color
            colors[i * 3] = baseColor.r;
            colors[i * 3 + 1] = baseColor.g;
            colors[i * 3 + 2] = baseColor.b;
        }
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.material = new THREE.PointsMaterial({
            size: PARTICLE_SIZE,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            sizeAttenuation: true,
            depthWrite: false
        });
        this.points = new THREE.Points(pointsGeometry, this.material);
        this.scene.add(this.points);
    }
    _create_class(ParticleBurst, [
        {
            key: "update",
            value: function update(deltaTime) {
                this.lifetime -= deltaTime;
                if (this.lifetime <= 0) {
                    this.dispose();
                    return false; // Indicate burst is finished
                }
                // Update opacity based on lifetime (fade out)
                this.material.opacity = Math.max(0, this.lifetime / PARTICLE_LIFETIME);
                // Update particle positions
                var positions = this.points.geometry.attributes.position.array;
                for(var i = 0; i < PARTICLE_COUNT; i++){
                    positions[i * 3] += this.velocities[i].x * deltaTime;
                    positions[i * 3 + 1] += this.velocities[i].y * deltaTime;
                    positions[i * 3 + 2] += this.velocities[i].z * deltaTime;
                }
                this.points.geometry.attributes.position.needsUpdate = true;
                return true; // Indicate burst is still active
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                if (this.points) {
                    this.scene.remove(this.points);
                    this.points.geometry.dispose();
                    this.material.dispose();
                    this.points = null; // Allow garbage collection
                }
            }
        }
    ]);
    return ParticleBurst;
}();
// The main manager class
export var ParticleManager = /*#__PURE__*/ function() {
    "use strict";
    function ParticleManager(scene) {
        _class_call_check(this, ParticleManager);
        this.scene = scene;
        this.activeBursts = [];
    }
    _create_class(ParticleManager, [
        {
            key: "emit",
            value: function emit(position, color) {
                if (!position || typeof position.x === 'undefined') {
                    console.warn('ParticleManager: Invalid position provided for emit.');
                    return;
                }
                // console.log(`Emitting particle burst at [${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}] with color ${color}`);
                this.activeBursts.push(new ParticleBurst(this.scene, position, color));
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                // Update existing bursts and remove finished ones
                this.activeBursts = this.activeBursts.filter(function(burst) {
                    return burst.update(deltaTime);
                });
            // if (this.activeBursts.length > 0) console.log(`Updating ${this.activeBursts.length} particle bursts`);
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                // Clean up any remaining bursts when the manager is no longer needed
                this.activeBursts.forEach(function(burst) {
                    return burst.dispose();
                });
                this.activeBursts = [];
            }
        }
    ]);
    return ParticleManager;
}();
