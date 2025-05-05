import { useThree } from '@react-three/fiber'; // Adjusted import source
import { useEffect } from 'react';
import audioManager from './managersAudioManager.js'; // Adjusted import path
/**
 * React hook that attaches the AudioManager listener to the active camera
 * and returns the singleton instance for play/load calls.
 */ export default function useAudioManager() {
    var camera = useThree().camera;
    useEffect(function() {
        audioManager.attachTo(camera);
    }, [
        camera
    ]);
    return audioManager;
}
