/**
 * Spawning System
 * 
 * This is the main entry point for the modular spawning system.
 * It re-exports all functions from the individual modules for easy access.
 */ // Core spawning functionality (basic object placement)
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
export { spawnItem, spawnGrouped } from './spawnCore.js';
// Geometry utilities (surface point detection, volume creation)
export { getSurfacePoint, createBoundingVolume, extractVertices } from './geometryUtils.js';
// Physics-enabled spawning functionality
export { spawnWithPhysics, spawnPhysicsGroup } from 'physicsSpawner';
// Registry for tracking physics objects
export { registerPhysicsObject, unregisterPhysicsObject, getByBody, getByModel, getByCollider, getById, getBody, getModel, getCollider, syncAllPhysicsObjects, getRegistryStats } from 'spawnRegistry';
/**
 * Initializes the spawning system with default configuration
 * 
 * @param {Object} world - Rapier physics world
 * @param {Object} rapier - Rapier physics instance
 * @param {Object} [options] - Configuration options
 * @returns {Object} - Spawning system controller
 */ export function initSpawningSystem(world, rapier) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!world || !rapier) {
        console.error('Cannot initialize spawning system: Missing physics world or rapier instance');
        return null;
    }
    // Default configuration
    var config = _object_spread({
        defaultMargin: 0.1,
        defaultRadius: 0.5,
        defaultMinSpacing: 0.1,
        defaultCollisionType: 'box',
        defaultCollisionScale: 0.9,
        defaultMass: 1,
        defaultFriction: 0.3,
        defaultRestitution: 0.2
    }, options);
    /**
   * Helper method to spawn a single item with consistent defaults
   * 
   * @param {THREE.Object3D} prefab - Object to clone and place
   * @param {Object} tankBounds - Tank boundary info { min, max }
   * @param {Object} [spawnOptions] - Optional spawn parameters
   * @returns {THREE.Object3D} - The spawned object
   */ var spawn = function(prefab, tankBounds) {
        var spawnOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return spawnItem(prefab, tankBounds, world, rapier, spawnOptions.margin || config.defaultMargin);
    };
    /**
   * Helper method to spawn a group of items with consistent defaults
   * 
   * @param {THREE.Object3D[]} prefabs - Array of objects to spawn
   * @param {Object} tankBounds - Tank boundary info { min, max }
   * @param {Object} [spawnOptions] - Optional group spawn parameters
   * @returns {THREE.Object3D[]} - Array of spawned objects
   */ var spawnGroup = function(prefabs, tankBounds) {
        var spawnOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return spawnGrouped(prefabs, tankBounds, world, rapier, _object_spread({
            margin: config.defaultMargin,
            radius: config.defaultRadius,
            minSpacing: config.defaultMinSpacing
        }, spawnOptions));
    };
    /**
   * Helper method to spawn a physics-enabled object with consistent defaults
   * 
   * @param {THREE.Object3D} prefab - Object to clone and place
   * @param {Object} tankBounds - Tank boundary info { min, max }
   * @param {Object} [physicsOptions] - Optional physics parameters
   * @returns {Object} - Object with model, body and sync properties
   */ var spawnPhysics = function(prefab, tankBounds) {
        var physicsOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var result = spawnWithPhysics(prefab, tankBounds, world, rapier, _object_spread({
            margin: config.defaultMargin,
            collisionType: config.defaultCollisionType,
            collisionScale: config.defaultCollisionScale,
            mass: config.defaultMass,
            friction: config.defaultFriction,
            restitution: config.defaultRestitution
        }, physicsOptions));
        // Auto-register if successful
        if (result && result.model && result.body && result.collider) {
            registerPhysicsObject({
                model: result.model,
                body: result.body,
                collider: result.collider,
                sync: result.sync,
                type: physicsOptions.type || 'physicsObject',
                metadata: physicsOptions.metadata || {}
            });
        }
        return result;
    };
    /**
   * Helper method to spawn a group of physics-enabled objects with consistent defaults
   * 
   * @param {THREE.Object3D[]} prefabs - Array of objects to spawn
   * @param {Object} tankBounds - Tank boundary info { min, max }
   * @param {Object} [physicsOptions] - Optional physics parameters
   * @returns {Object[]} - Array of objects with model, body and sync properties
   */ var spawnPhysicsCluster = function(prefabs, tankBounds) {
        var physicsOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var results = spawnPhysicsGroup(prefabs, tankBounds, world, rapier, _object_spread({
            margin: config.defaultMargin,
            radius: config.defaultRadius,
            minSpacing: config.defaultMinSpacing,
            collisionType: config.defaultCollisionType,
            collisionScale: config.defaultCollisionScale,
            mass: config.defaultMass,
            friction: config.defaultFriction,
            restitution: config.defaultRestitution
        }, physicsOptions));
        // Auto-register all spawned objects
        results.forEach(function(result) {
            if (result && result.model && result.body && result.collider) {
                registerPhysicsObject({
                    model: result.model,
                    body: result.body,
                    collider: result.collider,
                    sync: result.sync,
                    type: physicsOptions.type || 'physicsObject',
                    metadata: physicsOptions.metadata || {}
                });
            }
        });
        return results;
    };
    /**
   * Cleans up all registered physics objects
   */ var cleanup = function() {
        // Get all registered objects and unregister them
        var stats = getRegistryStats();
        console.log("Cleaning up ".concat(stats.currentlyRegistered, " physics objects"));
        // We need to get all IDs first because the registry will change as we unregister
        var entries = [];
        for(var i = 0; i < stats.currentlyRegistered; i++){
            var entry = getRegistryStats();
            if (entry) entries.push(entry);
        }
        entries.forEach(function(entry) {
            if (entry) unregisterPhysicsObject(entry);
        });
    };
    // Return an object with simplified API
    return {
        spawn: spawn,
        spawnGroup: spawnGroup,
        spawnPhysics: spawnPhysics,
        spawnPhysicsCluster: spawnPhysicsCluster,
        syncAllPhysics: syncAllPhysicsObjects,
        registerObject: registerPhysicsObject,
        unregisterObject: unregisterPhysicsObject,
        getPhysicsBody: getBody,
        getPhysicsModel: getModel,
        getPhysicsCollider: getCollider,
        getStats: getRegistryStats,
        cleanup: cleanup,
        config: config
    };
}
