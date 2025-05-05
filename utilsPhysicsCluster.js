function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import * as THREE from 'three';
import { spawnPhysicsGroup } from './utilsSpawnHelpers.js';
/**
 * Creates and manages a complete physics cluster with lifecycle management
 * 
 * @param {Object} options - Configuration options
 * @param {THREE.Object3D[]} options.prefabs - Array of objects to clone and place
 * @param {Object} options.tankBounds - Tank boundary info { min, max }
 * @param {Object} options.world - Rapier world for physics
 * @param {Object} options.rapier - Rapier instance for physics objects
 * @param {THREE.Scene} options.scene - Scene to add objects to
 * @param {Object} options.spawnOptions - Options for spawnPhysicsGroup
 * @param {Function} options.onInit - Optional callback after initialization
 * @param {Function} options.onUpdate - Optional callback during updates
 * @param {Function} options.onCleanup - Optional callback before cleanup
 * @returns {Object} - Cluster manager with methods for control
 */ export function createPhysicsCluster(options) {
    var prefabs = options.prefabs, tankBounds = options.tankBounds, world = options.world, rapier = options.rapier, scene = options.scene, _options_spawnOptions = options.spawnOptions, spawnOptions = _options_spawnOptions === void 0 ? {} : _options_spawnOptions, _options_onInit = options.onInit, onInit = _options_onInit === void 0 ? null : _options_onInit, _options_onUpdate = options.onUpdate, onUpdate = _options_onUpdate === void 0 ? null : _options_onUpdate, _options_onCleanup = options.onCleanup, onCleanup = _options_onCleanup === void 0 ? null : _options_onCleanup;
    if (!(prefabs === null || prefabs === void 0 ? void 0 : prefabs.length) || !tankBounds || !world || !rapier || !scene) {
        console.error('Missing required parameters for physics cluster');
        return null;
    }
    // Internal state
    var physicsObjects = [];
    var isActive = false;
    var isPaused = false;
    // Remove all objects and cleanup physics bodies
    var cleanup = function() {
        if (onCleanup && typeof onCleanup === 'function') {
            onCleanup(physicsObjects);
        }
        physicsObjects.forEach(function(obj) {
            // Remove model from scene
            if (obj.model && obj.model.parent) {
                obj.model.parent.remove(obj.model);
                // Dispose geometries and materials
                if (obj.model.geometry) obj.model.geometry.dispose();
                if (obj.model.material) {
                    if (Array.isArray(obj.model.material)) {
                        obj.model.material.forEach(function(m) {
                            return m.dispose();
                        });
                    } else {
                        obj.model.material.dispose();
                    }
                }
            }
            // Remove physics body and collider if valid
            if (obj.body && obj.body.isValid()) {
                // Check if collider is still valid before removing
                if (obj.collider && world.getCollider(obj.collider.handle)) {
                    world.removeCollider(obj.collider, true);
                }
                // Remove rigid body if still valid in world
                if (world.getRigidBody(obj.body.handle)) {
                    world.removeRigidBody(obj.body);
                }
            }
        });
        physicsObjects = [];
        isActive = false;
    };
    // Initialize by spawning physics objects
    var init = function() {
        // Clean up any existing objects first
        cleanup();
        // Spawn new group of physics objects
        physicsObjects = spawnPhysicsGroup(prefabs, tankBounds, world, rapier, spawnOptions);
        // Add all models to scene
        physicsObjects.forEach(function(obj) {
            if (obj.model) {
                scene.add(obj.model);
            }
        });
        isActive = true;
        isPaused = false;
        // Call initialization callback if provided
        if (onInit && typeof onInit === 'function') {
            onInit(physicsObjects);
        }
        return physicsObjects.length > 0;
    };
    // Synchronize physics bodies with visual models
    var update = function(deltaTime) {
        if (!isActive || isPaused) return;
        physicsObjects.forEach(function(obj) {
            if (obj.sync) {
                obj.sync(deltaTime);
            }
        });
        // Call update callback if provided
        if (onUpdate && typeof onUpdate === 'function') {
            onUpdate(physicsObjects, deltaTime);
        }
    };
    // Get current objects
    var getObjects = function() {
        return _to_consumable_array(physicsObjects);
    };
    // Filter to valid objects only (removes invalid physics objects)
    var filterInvalidObjects = function() {
        physicsObjects = physicsObjects.filter(function(obj) {
            if (!obj.body || !obj.body.isValid()) {
                // Remove invalid object from scene
                if (obj.model && obj.model.parent) {
                    obj.model.parent.remove(obj.model);
                }
                return false;
            }
            return true;
        });
        return physicsObjects.length;
    };
    // Control methods
    var pause = function() {
        isPaused = true;
    };
    var resume = function() {
        isPaused = false;
    };
    // Apply forces to all physics bodies
    var applyForce = function(force) {
        var asImpulse = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        if (!isActive) return;
        physicsObjects.forEach(function(obj) {
            if (obj.body && obj.body.isValid()) {
                if (asImpulse) {
                    obj.body.applyImpulse(force, true);
                } else {
                    obj.body.applyForce(force, true);
                }
            }
        });
    };
    // Apply explosion force from a point
    var applyExplosion = function(position) {
        var strength = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10, radius = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 2, falloff = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
        if (!isActive) return;
        var explosionPos = _instanceof(position, THREE.Vector3) ? position : new THREE.Vector3(position.x, position.y, position.z);
        physicsObjects.forEach(function(obj) {
            if (!obj.body || !obj.body.isValid()) return;
            var bodyPos = obj.body.translation();
            var bodyPosition = new THREE.Vector3(bodyPos.x, bodyPos.y, bodyPos.z);
            // Calculate direction and distance
            var direction = new THREE.Vector3().subVectors(bodyPosition, explosionPos);
            var distance = direction.length();
            // Skip if too far
            if (distance > radius) return;
            // Normalize direction
            direction.normalize();
            // Calculate force strength with distance falloff
            var forceMagnitude = strength;
            if (falloff) {
                forceMagnitude = strength * (1 - distance / radius);
            }
            // Create force vector
            var force = direction.multiplyScalar(forceMagnitude);
            // Apply as impulse
            obj.body.applyImpulse({
                x: force.x,
                y: force.y,
                z: force.z
            }, true);
        });
    };
    // Add a new object to the cluster
    var addObject = function(physicsObject) {
        if (!physicsObject || !physicsObject.model || !physicsObject.body) return false;
        // Add to scene if needed
        if (!physicsObject.model.parent) {
            scene.add(physicsObject.model);
        }
        physicsObjects.push(physicsObject);
        return true;
    };
    // Remove a specific object by reference
    var removeObject = function(physicsObject) {
        var index = physicsObjects.indexOf(physicsObject);
        if (index === -1) return false;
        // Remove from scene
        if (physicsObject.model && physicsObject.model.parent) {
            physicsObject.model.parent.remove(physicsObject.model);
        }
        // Remove physics parts if valid
        if (physicsObject.body && physicsObject.body.isValid()) {
            if (physicsObject.collider && world.getCollider(physicsObject.collider.handle)) {
                world.removeCollider(physicsObject.collider, true);
            }
            if (world.getRigidBody(physicsObject.body.handle)) {
                world.removeRigidBody(physicsObject.body);
            }
        }
        // Remove from array
        physicsObjects.splice(index, 1);
        return true;
    };
    // Set physical properties for all objects
    var setProperties = function(properties) {
        if (!isActive) return;
        var friction = properties.friction, restitution = properties.restitution, linearDamping = properties.linearDamping, angularDamping = properties.angularDamping, gravityScale = properties.gravityScale;
        physicsObjects.forEach(function(obj) {
            if (!obj.body || !obj.body.isValid() || !obj.collider) return;
            // Set collider properties
            if (typeof friction === 'number') {
                obj.collider.setFriction(friction);
            }
            if (typeof restitution === 'number') {
                obj.collider.setRestitution(restitution);
            }
            // Set rigid body properties
            if (typeof linearDamping === 'number') {
                obj.body.setLinearDamping(linearDamping);
            }
            if (typeof angularDamping === 'number') {
                obj.body.setAngularDamping(angularDamping);
            }
            if (typeof gravityScale === 'number') {
                obj.body.setGravityScale(gravityScale);
            }
        });
    };
    // Check if any object is within a distance of a point
    var isAnyObjectNear = function(position, maxDistance) {
        if (!isActive) return false;
        var checkPos = _instanceof(position, THREE.Vector3) ? position : new THREE.Vector3(position.x, position.y, position.z);
        return physicsObjects.some(function(obj) {
            if (!obj.body || !obj.body.isValid()) return false;
            var bodyPos = obj.body.translation();
            var bodyPosition = new THREE.Vector3(bodyPos.x, bodyPos.y, bodyPos.z);
            return bodyPosition.distanceTo(checkPos) <= maxDistance;
        });
    };
    // Public API
    return {
        init: init,
        cleanup: cleanup,
        update: update,
        pause: pause,
        resume: resume,
        getObjects: getObjects,
        filterInvalidObjects: filterInvalidObjects,
        applyForce: applyForce,
        applyExplosion: applyExplosion,
        addObject: addObject,
        removeObject: removeObject,
        setProperties: setProperties,
        isAnyObjectNear: isAnyObjectNear,
        // Properties
        get count () {
            return physicsObjects.length;
        },
        get active () {
            return isActive;
        },
        get paused () {
            return isPaused;
        }
    };
}
