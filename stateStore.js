import { create } from 'https://esm.sh/zustand@4.4.7?external=react';
export var GamePhases = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
};
var useGameStore = create(function(set) {
    return {
        phase: GamePhases.MENU,
        score: 0,
        highScore: 0,
        gameTime: 0,
        setPhase: function(phase) {
            return set({
                phase: phase
            });
        },
        startGame: function() {
            return set(function() {
                return {
                    phase: GamePhases.PLAYING,
                    score: 0
                };
            });
        },
        pauseGame: function() {
            return set({
                phase: GamePhases.PAUSED
            });
        },
        resumeGame: function() {
            return set({
                phase: GamePhases.PLAYING
            });
        },
        gameOver: function() {
            return set(function(state) {
                return {
                    phase: GamePhases.GAME_OVER,
                    highScore: Math.max(state.highScore, state.score)
                };
            });
        },
        addScore: function(points) {
            return set(function(state) {
                return {
                    score: state.score + points
                };
            });
        },
        // Function to update the game time
        setGameTime: function(time) {
            return set({
                gameTime: time
            });
        }
    };
});
export default useGameStore;
