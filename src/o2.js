const EventEmitter = require('events').EventEmitter;
const logger = require('./logger');
const Rcon = require('./rcon');
const ConfigReader = require('./config');

class O2 extends EventEmitter {
    constructor(configFilePath) {
        super();
        this.configFilePath = configFilePath || 'server.json';
        this.rcon = null;
        this.config = null;
        this.configReader = null;
    }

    run() {
        this.configReader = new ConfigReader();
        logger.splashScreen();
        this.configReader.read(this.configFilePath).then((config) => {
            this.config = config;
            this.rcon = new Rcon(this.config.rust_server);
            this.rcon.init();
            // TODO: plugins
        }, (err) => {
            logger.error(err);
            process.exit(1);
        });
    }
}

module.exports = O2;