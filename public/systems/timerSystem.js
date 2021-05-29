/*
The timer system handles the timing and logic of the timer functionality. 

The states of the timers and its transitions are shown here:

0 : false :: 1 : true

                +-----------------------+--------------+
                |               isStopped               |
                +-----------------------+--------------+
                |           0           |       1      |
+-----------+---+-----------------------+--------------+
|           |   | +-------------------+ |              |
|           |   | | isIdle            | |              |
|           |   | +-------------------+ |              |
|           |   | |    0    |    1    | |              |  /\          |
|           | 0 | +-------------------+ |    Stopped    |  |           |
| isBlocked |   | | Running |  Idle   | |              |  |           |
|           |   | +-------------------+ |              |  |           | 
|           |   |    <----Start-----    |              |  | Unblock   | Block
|           |   |    ------End----->    |              |  |           |
|           +---+-----------------------+--------------+  |           |
|           |   |                       |    Blocked   |  |           |
|           | 1 |        Blocked        |      and     |  |           \/
|           |   |                       |    stopped    |
+-----------+---+-----------------------+--------------+
                            <-------Start--------
                            --------Pause------->

                            <-------Toggle------>

- Running:          the timer is counting down.
- Idle:             the timer has finished its countdown and is waiting to restart automatically.
- Blocked:          the timer is not counting down because of a blocker.
- Stopped:           the timer is not counting down because it was stopped manually.
- Blocked & stopped: the timer was blocked when it was stopped.

The timer system is also an event emitter that emits the following events:
    - timer-end: when the timer counts down to zero, or is manually ended.

*/

const states = {
    RUNNING: 'running',
    IDLE: 'idle',
    BLOCKED: 'blocked',
    STOPPED: 'stopped',
    BLOCKED_AND_STOPPED: 'blocked_and_stopped'
}

module.exports = function () {

    this._events = {};

    this.timeout;

    // Interval for sending updated timer info
    this.sendingInterval;

    // Flags and variables to track timer status
    this.isStopped = true;
    this.isBlocked = false;
    this.isIdle = false;

    this.endDate = new Date();  // The Date Object indicating when the timer will end
    this.totalDuration = global.store.get('preferences.notifications.interval') * 60000; // In milliseconds
    this.savedTime = this.totalDuration;    // Stores the remaining time when the timer is stopped or blocked
    
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
        if (this.isStopped) {
            if (this.isBlocked)
                return states.BLOCKED_AND_STOPPED;
            else
                return states.STOPPED;
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
                if (this.savedTime != null) return this.savedTime   // Use this only if the timer is stopped or blocked
                else return this.endDate - new Date();      // Otherwise, calculate it dynamically
                })(),
            isBlocked: this.isBlocked,
            isStopped: this.isStopped,
            isIdle: this.isIdle
        }
    };

    /**
     * Updates the timer.
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
            case states.BLOCKED_AND_STOPPED:
            case states.STOPPED:

                this.totalDuration = global.store.get('preferences.notifications.interval') * 60000;
                this.savedTime = this.totalDuration;
                clearTimeout(this.timeout);

                break;
        }

        this.resetSendingInterval();
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
     * Resets the interval for sending timer updates
     */
    this.resetSendingInterval = function() {
        clearInterval(this.sendingInterval);
        
        if (global.mainWindow && !global.mainWindow.isDestroyed())
            global.mainWindow.webContents.send('receive-timer-status', this.getStatus());

        this.sendingInterval = setInterval( () => {
            if (global.mainWindow && !global.mainWindow.isDestroyed())
                global.mainWindow.webContents.send('receive-timer-status', this.getStatus());
        }, 1000);    
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
        this.isStopped = false;

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
        this.isStopped = false;

        this.update();
    };

    /**
     * Pauses the timer
     */
    // Conditions to ignore
    this.stop = function () {
        if (this.isStopped) return;

        // Set flags
        this.isIdle = false;
        this.isStopped = true;
        
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
     * or starts the timer when it is stopped or blocked.
     */
    this.togglePause = function () {
        if (this.isStopped)
            this.start();
        else
            this.stop();
    }

}