const EventEmitter = require('events').EventEmitter;
const logger = require('./logger');
const Rcon = require('./rcon');
const ConfigReader = require('./config');

const sql = require('./connectors/sql_connector');

const InputHandler = require('./handlers/stdin_handler');
const ChatHandler = require('./handlers/chat_handler');
const CmdHandler = require('./handlers/cmd_handler');
const PlayerHandler = require('./handlers/player_handler');
const CommandManager = require('./managers/command_manager');


class O2 extends EventEmitter {
    constructor(configFilePath) {
        super();
        this.configFilePath = configFilePath || 'server.json';
        this.rcon = null;
        this.config = null;
        this.configReader = null;
        this.commandManager = null;
        O2.instance = this;
    }

    run() {
        this.configReader = new ConfigReader();
        logger.splashScreen();
        this.configReader.read(this.configFilePath).then((config) => {
            this.config = config;
            sql.config(this.config.sql_server);
            this.rcon = new Rcon(this.config.rust_server);
            this.rcon.init();
            this.rcon.addListener('chat-message', (msg) => {
                logger.log(`[PLAYER/CHAT](${msg.Username}): ${msg.Message}`);
                
            });
            this.rcon.addListener('data', (msg) => {
                logger.log(`[SERVER/INFO]: ${msg.toString()}`);
            });
            this.commandManager = new CommandManager();
            this.commandManager.registerCommands();
            // TODO: plugins
        }, (err) => {
            logger.error(err);
            process.exit(1);
        });
    }

    registerInputHandler(input, output) {
        return InputHandler.registerNew(this, input, output); 
    }
}

O2.instance = null;

module.exports = O2;