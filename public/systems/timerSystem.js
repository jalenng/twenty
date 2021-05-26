/*
The timer system handles the timing and logic of the timer functionality. 

The states of the timers and its transitions are shown here:

0 : false :: 1 : true

                +-----------------------+--------------+
                |               isPaused               |
                +-----------------------+--------------+
                |           0           |       1      |
+-----------+---+-----------------------+--------------+
|           |   | +-------------------+ |              |
|           |   | | isIdle            | |              |
|           |   | +-------------------+ |              |
|           |   | |    0    |    1    | |              |  /\          |
|           | 0 | +-------------------+ |    Paused    |  |           |
| isBlocked |   | | Running |  Idle   | |              |  |           |
|           |   | +-------------------+ |              |  |           | 
|           |   |    <----Start-----    |              |  | Unblock   | Block
|           |   |    ------End----->    |              |  |           |
|           +---+-----------------------+--------------+  |           |
|           |   |                       |    Blocked   |  |           |
|           | 1 |        Blocked        |      and     |  |           \/
|           |   |                       |    paused    |
+-----------+---+-----------------------+--------------+
                            <-------Start--------
                            --------Pause------->

                            <-------Toggle------>

- Running:          the timer is counting down.
- Idle:             the timer has finished its countdown and is waiting to restart automatically.
- Blocked:          the timer is not counting down because of a blocker.
- Paused:           the timer is not counting down because it was stopped manually.
- Blocked & paused: the timer was blocked when it was paused.

The timer system is also an event emitter that emits the following events:
    - timer-end: when the timer counts down to zero, or is manually ended.

*/

const states = {
    RUNNING: 'running',
    IDLE: 'idle',
    BLOCKED: 'blocked',
    PAUSED: 'paused',
    BLOCKED_AND_PAUSED: 'blocked_and_paused'
}

module.exports = function () {

    this._events = {};

    this.timeout;

    // Flags and variables to track timer status
    this.isPaused = true;
    this.isBlocked = false;
    this.isIdle = false;

    this.endDate = new Date();  // The Date Object indicating when the timer will end
    this.totalDuration = global.store.get('preferences.notifications.interval') * 60000; // In milliseconds
    this.savedTime = this.totalDuration;    // Stores the remaining time when the timer is paused or blocked
    
    /**
     * Registers an event listener
     */
    this.on = function (name, listener) {
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
     * Gets the state of the timer.
     * @returns a string indicating the state.
     */
     this.getState = function () {
        if (this.isPaused) {
            if (this.isBlocked)
                return states.BLOCKED_AND_PAUSED;
            else
                return states.PAUSED;
        }
        else {
            if (this.isBlocked)
                return states.BLOCKED;
            else if (this.isIdle)
                return states.IDLE;
            else
                return states.RUNNING;
        }
    }

    /**
     * Gets the status of the timer system
     * @returns an object
     */
    this.getStatus = function () {
        return { 
            endDate: this.endDate,
            totalDuration: this.totalDuration,
            remainingTime: (() => {
                if (this.savedTime != null) return this.savedTime   // Use this only if the timer is paused or blocked
                else return this.endDate - new Date();      // Otherwise, calculate it dynamically
                })(),
            isBlocked: this.isBlocked,
            isPaused: this.isPaused,
            isIdle: this.isIdle
        }
    };

    /**
     * Updates the timer.
     * @returns 
     */
    this.update = function () {
        switch (this.getState()) {
            case states.RUNNING:
                if (this.savedTime === 0) this.reset();
                else this.setup();

                break;

            // End timer and begin break
            case states.IDLE:
                
                this.savedTime = 0;
                clearTimeout(this.timeout);

                this.emit('timer-end', callback => callback(this.totalDuration));

                break;

            // The timer should not be running here
            case states.BLOCKED:
            case states.BLOCKED_AND_PAUSED:
            case states.PAUSED:

                // Save the time if it's not already saved
                if (this.savedTime === null) this.savedTime = this.endDate - new Date();
                clearTimeout(this.timeout);

                break;

        }
    }

    /**
     * Sets up the timer
     */
    this.setup = function () {
        // Use JS timeouts to facilitate delay
        clearTimeout(this.timeout)
        this.timeout = setTimeout(this.end.bind(this), this.savedTime);

        // Calculate the end date
        this.endDate = new Date();
        let msLeft = this.endDate.getMilliseconds() + this.savedTime;
        this.endDate.setMilliseconds(msLeft);

        this.savedTime = null;
    }

    /**
     * Resets the timer
     */
    this.reset = function () {
        this.totalDuration = global.store.get('preferences.notifications.interval') * 60000;
        this.savedTime = this.totalDuration

        if (this.getState() === states.RUNNING) this.setup();
    }

    /**
     * Starts the timer
     */
    this.start = function () {
        if (this.isBlocked) return;
        if (this.getState() === states.RUNNING) return;

        // Set flags
        this.isIdle = false;
        this.isPaused = false;

        this.update();
    };

    /** 
     * Ends the timer and starts the break
     */
    this.end = function () {
        if (this.isBlocked) return;
        if (this.isIdle) return;

        // Set flags
        this.isIdle = true;
        this.isPaused = false;

        this.update();
    };

    /**
     * Pauses the timer
     */
    // Conditions to ignore
    this.pause = function () {
        if (this.isPaused) return;

        // Set flags
        this.isIdle = false;
        this.isPaused = true;
        
        this.update();
    }

    /**
     * Blocks the timer from running
     */
    this.block = function () {
        if (this.isBlocked) return;

        // Set flag
        this.isBlocked = true;

        this.update();
    }

    /**
     * Unblocks the timer from running
     */
    this.unblock = function () {
        if (!this.isBlocked) return;

        // Set flag
        this.isBlocked = false;

        this.update();
    }

    /**
     * Pauses the timer if the timer is running,
     * or starts the timer when it is paused or blocked.
     */
    this.togglePause = function () {
        if (this.isPaused)
            this.start();
        else
            this.pause();
    }

}