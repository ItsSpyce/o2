const MessageHandler = require('./../handler');
const MessageType = require('./../utils').MessageType;

class ChatHandler extends MessageHandler {
    constructor(handler) {
        super((msg) => {
            return msg.Type === MessageType.CHAT && msg.Message.Message && !msg.Message.Message.startsWith('!');
        }, (msg) => {
            return handler(new ChatMessage(msg));
        });
    }
}

class ChatMessage {
    constructor(msg) {
        this.message = msg.Message.Message;
        this.userId = msg.Message.UserId;
        this.username = msg.Message.Username;
        this.color = msg.Message.Color;
        this.time = msg.Message.Time;
    }
}

module.exports = ChatHandler;