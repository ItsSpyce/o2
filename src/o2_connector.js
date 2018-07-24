const EventEmitter = require('events').EventEmitter;

class O2Connector extends EventEmitter {
    constructor(name, server) {
        super();
        this.name = name;
    }

    onInitialize(handler) {
        this.addListener('initialize', handler);
    }

    onShutdown(handler) {
        this.addListener('shutdown', handler);
    }

    onConfig(handler) {
        this.addListener('config', handler);
    }

    initialize() {
        this.emit('initialize');
    }

    shutdown() {
        this.emit('shutdown');
    }

    config(config) {
        this.config = config;
        this.emit('config', config);
    }
}

module.exports = O2Connector;