const EventEmitter = require('events').EventEmitter;

class EventBus extends EventEmitter {
    constructor() {
        super();
    }

    registerEventHandler(eventName, handler) {
        
    }
}

module.exports = EventBus;