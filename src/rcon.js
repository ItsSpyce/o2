const WebSocket = require('ws');
const EventEmitter = require('events').EventEmitter;
const logger = require('./logger');
const MessageType = require('./utils').MessageType;

const RCON_RANGE_MIN = 1337000000;
const RCON_RANGE_MAX = 1337999999;

class Rcon extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.socket = null;
    }

    init() {
        logger.title('RCON');
        logger.log('Initializing RCON...');
        try {
            this.connect();
        } catch (ex) {
            logger.error('Failed to connect RCON: ' + ex.message);
        }
    }

    connect() {
        this.socket = new WebSocket(`ws://${this.config.host}:${this.config.webrcon_port}/${this.config.webrcon_password}`);
        this.socket.on('error', (error) => {
            logger.error(`[RCON/ERROR]: ${error}`);
            this.emit('error', error);
        });

        this.socket.on('close', (e) => {
            logger.error('[RCON/INFO]: Disconnected');
            this.emit('close', e);
            this.reconnect();
        });

        this.socket.on('open', (e) => {
            logger.success('[RCON/INFO]: Connected');
            this.emit('open', e);
            //this.sendMessage('O2 now running.');
        });

        this.socket.on('message', (serializedData) => {
            const data = JSON.parse(serializedData);
            logger.debug(JSON.stringify(data));
            switch (data.Type) {
                case MessageType.CHAT:
                    const message = JSON.parse(data.Message);
                    this.emit('chat-message', message);
                    break;
                case MessageType.GENERIC:
                    if (data.Message.startsWith("[CHAT]")) break;
                    if (data.Message && data.Identifier < RCON_RANGE_MIN && data.Identifier > RCON_RANGE_MAX) {
                        
                    }
                    this.emit('data', data.Message);
                    break;
            }
        });
    }

    reconnect() {
        logger.log(`[RCON/INFO]: Trying to reconnect with a timeout of ${this.config.reconnect_interval}ms`);
        setTimeout(() => {
            this.connect();
        }, this.config.reconnect_interval);
    }

    sendMessage(message) {
        this.sendCommand(`say ${message}`);
    }

    sendCommand(command) {
        const commandIdentifier = this.generateRandomCommandId();

        const packet = JSON.stringify({
            Identifier: commandIdentifier,
            Message: command,
            Name: 'WebRcon'
        });

        this.socket.send(packet);

        return new Promise((resolve, reject) => {
            const commandResponseCallback = (serializedData) => {
                const data = JSON.parse(serializedData);

                if (data.Type === MessageType.GENERIC && data.Identifier === commandIdentifier) {
                    this.socket.removeEventListener('message', commandResponseCallback);
                    return resolve(data.Message);
                }
            }

            setTimeout(() => {
                this.socket.removeEventListener('message', commandResponseCallback);
                return resolve(`${command} didn't return a response`);
            }, 5 * 1000);

            this.socket.on('message', commandResponseCallback);
        });
    }

    generateRandomCommandId() {
        return Math.floor(Math.random() * (RCON_RANGE_MAX - RCON_RANGE_MIN)) + RCON_RANGE_MIN;
    }
}

module.exports = Rcon;