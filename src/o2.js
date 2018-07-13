const EventEmitter = require('events').EventEmitter;
const logger = require('./logger');
const Rcon = require('./rcon');
const ConfigReader = require('./config');

const sql = require('./connectors/sql_connector');

const MessageHandler = require('./handler');
const Command = require('./command');
const handlerLoader = require('./handlers/handler_loader');
const cmdLoader = require('./commands/cmd_loader');

class O2 extends EventEmitter {
    constructor(configFilePath) {
        super();
        this.configFilePath = configFilePath || 'server.json';
        this.rcon = null;
        this.config = null;
        this.configReader = null;
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
                logger.log(`[PLAYER/CHAT](${MessageChannel.Username}): ${msg.Message}`);
                
            });
            this.rcon.addListener('data', (msg) => {
                logger.log(`[SERVER/INFO]: ${msg.toString()}`);
            });
            // TODO: plugins
        }, (err) => {
            logger.error(err);
            process.exit(1);
        });
    }
}

O2.instance = null;

module.exports = O2;