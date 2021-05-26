/*
The break system handles the timing and logic of the breaks. 

The states of the break system are as follows:
    - isOnBreak
        - true <---> false

The break system is also an event emitter that emits the following events:
    - break-start: when the break begins
    - break-times-set: when the break countdown resets (due to the user moving their mouse)
    - break-intermediate: when the break reaches an intermediate mark (5 seconds)
    - break-end: when the break countdown reaches to zero
*/

require ('hazardous');
const path = require('path'); 

const { screen } = require('electron');
const soundPlayer = require('sound-play');

const BREAK_DURATION = 20000;
const POPUP_NOTIF_DURATION = 5000;

var oldMousePos;
var checkMousePositionInterval;

var mainTimeout;
var intermediateTimeout;

module.exports = function(){

    this._events = {};

    this.isOnBreak = false;
    this.totalDuration = 0;
    this.endTime = new Date();

    /**
     * Registers an event listener
     */
    this.on = function(name, listener) {
        if (!this._events[name]) this._events[name] = [];
        this._events[name].push(listener);
    }
    
    /**
     * Emits an event and invokes the functions of its listeners
     * @param {string} eventName    name of event to emit
     * @param {(callback) => any} fireCallbacks 
     */
    this.emit = function (eventName, fireCallbacks=callback => callback()) {
        this._events[eventName].forEach(fireCallbacks);
    }

    /**
     * Gets the status of the break system
     * @returns an object
     */
    this.getStatus = function() {

        let remainingTime = this.isOnBreak
                ? this.endTime - new Date()
                : this.totalDuration;

        let breakStatus = {
            isOnBreak: this.isOnBreak,
            endTime: this.endTime,
            duration: this.totalDuration,
            remainingTime: remainingTime
        }

        return breakStatus;
    };

    /**
     * Starts the break. Calls this.setupTimes in the process.
     */
    this.start = function() {

        if (this.isOnBreak) return;

        this.isOnBreak = true;

        if (global.store.get('preferences.notifications.enableSound') === true) 
            this.playSound();

        this.setupTimes();
                    
        // Set interval to continuously check mouse position
        oldMousePos = screen.getCursorScreenPoint();
        checkMousePositionInterval = setInterval(() => {
            var newMousePos = screen.getCursorScreenPoint();
            var mouseMoved = newMousePos.x != oldMousePos.x || newMousePos.y != oldMousePos.y;

            if (mouseMoved) {
                this.setupTimes();
                oldMousePos = newMousePos;
            }

        }, 100);            
        
        this.emit('break-start')

    }
    
    /**
     * Initializes the end time and timeout
     */
    this.setupTimes = function() {

        this.emit('break-times-set')

        this.endTime = new Date();
        this.endTime.setMilliseconds(this.endTime.getMilliseconds() + BREAK_DURATION);
        
        this.totalDuration = BREAK_DURATION;
        
        clearTimeout(mainTimeout)
        clearTimeout(intermediateTimeout)

        mainTimeout = setTimeout(this.end.bind(this), BREAK_DURATION);
        intermediateTimeout = setTimeout(() => {
            // Call break-intermediate listeners after POPUP_NOTIF_DURATION
            this.emit('break-intermediate')
        }, POPUP_NOTIF_DURATION);
    }

    /**
     * Ends the break and emits the 'break-end' event
     */
    this.end = function() {

        if (this.isOnBreak) {

            if (global.store.get('preferences.notifications.enableSound') === true) 
                this.playSound();

            clearTimeout(mainTimeout)
            clearTimeout(intermediateTimeout)
            clearInterval(checkMousePositionInterval)

            this.emit('break-end')

            this.isOnBreak = false; 
        }

    }

    /**
     * Plays the sound stored in the store under preferences.notifications.sound
     */
    this.playSound = function() {
        let soundKey = global.store.get('preferences.notifications.sound');
        let volume = global.store.get('preferences.notifications.soundVolume') / 100;

        let fullFilepath = path.isAbsolute(soundKey)
            ? soundKey
            : path.join(__dirname, soundKey);
        soundPlayer.play(fullFilepath, volume);
    }

}