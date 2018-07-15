const MessageHandler = require('./../handler');
const MessageType = require('./../utils').MessageType;

class CommandHandler extends MessageHandler {
    constructor(handler) {
        super((msg) => {
            return msg.Type === MessageType.CHAT && msg.Message.Message.startsWith('!');
        }, (msg) => {
            
        });
    }
}

module.exports = CommandHandler;