import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStore, { GamePhases } from './stateStore.js';
// Game duration in seconds
var GAME_DURATION_SECONDS = 90;
/**
 * Custom hook to manage the main game loop logic, including game over timer.
 * Runs tasks on every frame when the game is in the PLAYING phase.
 */ export var useGameLoop = function() {
    var _useGameStore = useGameStore(function(state) {
        return {
            phase: state.phase,
            setGameTime: state.setGameTime,
            gameOver: state.gameOver
        };
    }), phase = _useGameStore.phase, setGameTime = _useGameStore.setGameTime, gameOver = _useGameStore.gameOver;
    var gameTimeRef = useRef(useGameStore.getState().gameTime);
    var lastUpdateTime = useRef(0);
    // Sync internal ref with state when phase changes to MENU (reset)
    useEffect(function() {
        if (phase === GamePhases.MENU) {
            gameTimeRef.current = 0;
            setGameTime(0);
        }
    }, [
        phase,
        setGameTime
    ]);
    useFrame(function(state, frameDelta) {
        // Only run game logic if the game is actively playing
        if (phase !== GamePhases.PLAYING) {
            lastUpdateTime.current = state.clock.elapsedTime; // Keep track of time even when paused/menu
            return;
        }
        var currentTime = state.clock.elapsedTime;
        // Use the reliable frameDelta provided by useFrame for game logic updates
        var deltaTime = frameDelta; // Use frameDelta for consistent time steps
        // Update game time
        gameTimeRef.current += deltaTime;
        setGameTime(gameTimeRef.current); // Update the global state
        // Check for game over condition
        if (gameTimeRef.current >= GAME_DURATION_SECONDS) {
            gameOver(); // Call the gameOver action from the store
        // No need to return here, the phase change will stop the loop logic next frame
        }
        lastUpdateTime.current = currentTime;
    // --- Other game logic updates go here ---
    // Example: console.log('Game Loop Tick:', deltaTime, 'Total Time:', gameTimeRef.current);
    // TODO: Add enemy movement, etc.
    });
// No return value needed for now, the hook performs actions via useFrame
};
