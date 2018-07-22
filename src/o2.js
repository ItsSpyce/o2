const EventEmitter = require('events').EventEmitter;
const logger = require('./logger');
const Rcon = require('./rcon');
const ConfigReader = require('./config');

const O2Connector = require('./o2_connector');

const InputHandler = require('./handlers/stdin_handler');
const ChatHandler = require('./handlers/chat_handler');
const CmdHandler = require('./handlers/cmd_handler');
const PlayerHandler = require('./handlers/player_handler');
const CommandManager = require('./managers/command_manager');


/**
 * The server object that handles the configuration and RCON connections. 
 */
class O2 extends EventEmitter {
    constructor(configFilePath) {
        super();
        this.configFilePath = configFilePath || 'server.json';
        this.rcon = null;
        this.config = null;
        this.configReader = null;
        this.commandManager = null;
        this.registeredConnectors = [];
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
            this.rcon.addListener('chat-message', (msg) => {
                this.sendMessage(`[PLAYER/CHAT](${msg.Username}): ${msg.Message}`);
                
            });
            this.rcon.addListener('data', (msg) => {
                this.sendMessage(`[SERVER/INFO]: ${msg.toString()}`);
            });
            this.commandManager = new CommandManager();
            this.commandManager.registerCommands();
            
            this.registeredConnectors.forEach((connector) => {
                connector.config(config);
                connector.initialize();
            });
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
            this.registeredConnectors.push(connector);
        } else {
            throw new Error('Connector is not an O2Connector');
        }
    }
}

let instance = null;

module.exports = O2;