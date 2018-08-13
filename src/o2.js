const EventEmitter = require('events').EventEmitter;
const colors = require('colors');
const logger = require('./logger');
const Rcon = require('./rcon');
const EventBus = require('./event_bus');
const ConfigReader = require('./config');

const O2Connector = require('./o2_connector');

const InputHandler = require('./handlers/stdin_handler');
const CommandManager = require('./managers/command_manager');

/**
 * The server object that handles the configuration and RCON connections. 
 */
class O2 extends EventEmitter {
    /**
     * Creates an instance of an O2Server.
     * @param {String} configFilePath The path of the configuration file. Default is 'server.json'.
     * @memberof O2
     */
    constructor(configFilePath) {
        super();
        this.configFilePath = configFilePath || 'server.json';
        this.rcon = null;
        this.config = null;
        this.configReader = null;
        this.commandManager = null;
        this.registeredConnectors = Object.create(null);
        this.eventBus = new EventBus();
        instance = this;
    }

    /**
     * Returns the current O2 instance.
     * @returns {O2}
     */
    static get instance() {
        return instance;
    }

    /**
     * Initializes the current server and begins listening to the RCON connection.
     */
    run() {
        this.configReader = new ConfigReader();
        logger.splashScreen();
        this.configReader.read(this.configFilePath).then((config) => {
            this.config = config;
            this.rcon = new Rcon(this.config.rust_server);
            this.rcon.init();
            this.eventBus.initialize(this);
            this.eventBus.on('playerChat', (event) => {
                this.sendMessage(`${event.username}: ${event.message}`);
            });
            this.eventBus.on('playerJoin', (event) => {
                this.sendMessage(`${event.username} joined the game`);
            })
            this.commandManager = new CommandManager();
            this.commandManager.registerCommands();
            
            for (let cname in this.registeredConnectors) {
                let connector = this.registeredConnectors[cname];
                connector.config(config);
                connector.initialize();
                logger.debug(`Initialized connector ${connector.name}`);
            }
            // TODO: plugins
        }, (err) => {
            logger.error(err);
            process.exit(1);
        });
    }

    /**
     * Sends a message to all the input stream connections.
     * @param {String} msg
     * @memberof O2
     */
    sendMessage(msg) {
        InputHandler.registeredInputs.forEach((input) => {
            input.sendMessage(msg);
        });
    }

    /**
     * Sends an error to all the input stream connections.
     * @param {Error|String} error
     * @memberof O2
     */
    sendError(error) {
        InputHandler.registeredInputs.forEach((input) => {
            input.sendMessage(colors.red(error));
        });
    }

    /**
     * Registers a new input handler to the server with the given stdin and stdout.
     * @param {Buffer} input
     * @param {Buffer} output
     * @returns {InputHandler}
     * @memberof O2
     */
    registerInputHandler(input, output) {
        return InputHandler.registerNew(this, input, output); 
    }

    /**
     * Registers a connector within the server.
     * @param {O2Connector} connector 
     * @memberof O2
     */
    registerConnector(connector) {
        if (connector instanceof O2Connector) {
            this.registeredConnectors[connector.name] = connector;
        } else {
            throw new Error('Connector is not an O2Connector');
        }
    }

    /**
     * Returns a registered O2Connector within the server.
     * @param {String} name
     * @returns {O2Connector}
     * @memberof O2
     */
    getConnector(name) {
        if (!name || name.length === 0 || typeof name !== 'string') {
            throw new Error('invalid connector name');
        }
        return this.registeredConnectors[name];
    }
}

let instance = null;

module.exports = O2;