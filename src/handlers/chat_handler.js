const MessageHandler = require('./../handler');
const MessageType = require('./../utils').MessageType;

class ChatHandler extends MessageHandler {
    constructor() {
        super((msg) => {
            return msg.Type === MessageType.CHAT && msg.Message.Message && !msg.Message.Message.startsWith('!');
        }, (msg) => {
            var message = new ChatMessage(msg);
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