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
import { AudioListener, AudioLoader, Audio } from 'three';
/** Singleton AudioManager */ var AudioManager = /*#__PURE__*/ function() {
    "use strict";
    function AudioManager() {
        _class_call_check(this, AudioManager);
        if (AudioManager._instance) return AudioManager._instance;
        AudioManager._instance = this;
        this.listener = new AudioListener();
        this.loader = new AudioLoader();
        this.sounds = new Map(); // name → THREE.Audio
    }
    _create_class(AudioManager, [
        {
            /** Attach listener to the scene’s active camera. */ key: "attachTo",
            value: function attachTo(camera) {
                if (!camera.children.includes(this.listener)) camera.add(this.listener);
            }
        },
        {
            /** Pre-load a sound buffer and store it by name. */ key: "load",
            value: function load(name, url) {
                var _this = this;
                return new Promise(function(resolve, reject) {
                    _this.loader.load(url, function(buffer) {
                        var sound = new Audio(_this.listener);
                        sound.setBuffer(buffer);
                        _this.sounds.set(name, sound);
                        resolve(sound);
                    }, undefined, reject);
                });
            }
        },
        {
            /** Play a loaded sound; warn if missing. */ key: "play",
            value: function play(name) {
                var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref_volume = _ref.volume, volume = _ref_volume === void 0 ? 1 : _ref_volume, _ref_loop = _ref.loop, loop = _ref_loop === void 0 ? false : _ref_loop;
                var sound = this.sounds.get(name);
                if (!sound) {
                    console.warn('Audio "'.concat(name, '" not loaded or found.'));
                    return; // Exit if sound is not found
                }
                // Stop the sound before playing again to prevent overlap issues if called rapidly
                if (sound.isPlaying) {
                    sound.stop();
                }
                sound.setVolume(volume);
                sound.setLoop(loop);
                // Use play() which handles context resuming if needed
                sound.play();
            }
        },
        {
            // Optional: Method to stop a specific sound
            key: "stop",
            value: function stop(name) {
                var sound = this.sounds.get(name);
                if (sound && sound.isPlaying) {
                    sound.stop();
                }
            }
        },
        {
            // Optional: Method to stop all sounds
            key: "stopAll",
            value: function stopAll() {
                this.sounds.forEach(function(sound) {
                    if (sound.isPlaying) {
                        sound.stop();
                    }
                });
            }
        }
    ]);
    return AudioManager;
}();
// Export a single instance (singleton pattern)
var audioManagerInstance = new AudioManager();
export default audioManagerInstance;
