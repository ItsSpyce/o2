class MessageHandler {
    constructor(msgDelegate, handler) {
        this.msgDelegate = msgDelegate;
        this.handler = handler;
        MessageHandler.registeredHandlers.push(this);
    }

    check(message) {
        return this.msgDelegate(message);
    }
}

MessageHandler.registeredHandlers = [];

module.exports = MessageHandler;