/**
 * @file A base class for registering event listeners and emitting events.
 * @author jalenng
 */

class EventEmitter {
  constructor () {
    this._events = {}
  }

  /**
   * Registers an event listener
   */
  on (name, listener) {
    if (!this._events[name]) this._events[name] = []
    this._events[name].push(listener)
  }

  /**
   * Emits an event and invokes the functions of its listeners
   * @param {string} eventName    name of event to emit
   * @param {(callback) => any} fireCallbacks
   */
  emit (eventName, fireCallbacks = callback => callback()) {
    this._events[eventName].forEach(fireCallbacks)
  }
}

/** Exports */
module.exports = EventEmitter
