import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber'; // Adjusted import source
import { ParticleManager } from './managersParticleManager.js'; // Adjusted import path and assumed named export
/**
 * Provides a per-scene ParticleManager and an emit helper.
 * Call emitBurst(pos, color?) to spawn a one-shot effect.
 */ export var useParticles = function() {
    var scene = useThree().scene;
    var managerRef = useRef();
    // Lazily create manager once per scene
    if (!managerRef.current) {
        // Assuming ParticleManager needs the scene object in its constructor
        managerRef.current = new ParticleManager(scene);
    }
    // Advance particles each frame
    useFrame(function(_, dt) {
        if (managerRef.current && typeof managerRef.current.update === 'function') {
            managerRef.current.update(dt);
        }
    });
    // Ensure managerRef.current exists before trying to access its methods
    var emitBurst = function(position) {
        var color = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0xffffff;
        if (managerRef.current && typeof managerRef.current.emit === 'function') {
            managerRef.current.emit(position, color);
        } else {
            console.warn('ParticleManager or emit method not available.');
        }
    };
    return {
        emitBurst: emitBurst
    };
};
