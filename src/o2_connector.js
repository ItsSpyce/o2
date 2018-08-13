const EventEmitter = require('events').EventEmitter;

/**
 * A service that hooks into O2.
 *
 * @class O2Connector
 * @extends {EventEmitter}
 */
class O2Connector extends EventEmitter {
    /**
     * Creates an instance of O2Connector.
     * @param {String} name
     * @param {O2} server
     * @memberof O2Connector
     */
    constructor(name, server) {
        super();
        this.name = name;
    }

    /**
     * Adds an event handler to the 'initialize' event.
     *
     * @param {() => void} handler
     * @memberof O2Connector
     */
    onInitialize(handler) {
        this.addListener('initialize', handler);
    }

    /**
     * Adds an event handler to the 'shutdown' event.
     *
     * @param {() => void} handler
     * @memberof O2Connector
     */
    onShutdown(handler) {
        this.addListener('shutdown', handler);
    }

    /**
     * Adds an event handler to the 'config' event.
     *
     * @param {(config: *) => void} handler
     * @memberof O2Connector
     */
    onConfig(handler) {
        this.addListener('config', handler);
    }

    /**
     * Initializes the connector and calls the 'initialize' listener.
     *
     * @memberof O2Connector
     */
    initialize() {
        this.emit('initialize');
    }

    /**
     * Shuts down the connector and calls the 'shutdown' listener.
     *
     * @memberof O2Connector
     */
    shutdown() {
        this.emit('shutdown');
    }

    /**
     * Configures the connector and calls the 'config' listener.
     *
     * @param {*} config
     * @memberof O2Connector
     */
    config(config) {
        this.config = config;
        this.emit('config', config);
    }
}

module.exports = O2Connector;