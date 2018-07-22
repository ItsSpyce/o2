class CommandSender {
    constructor(base) {
        this.$base = base;
    }

    sendMessage(msg) {
        throw new Error('sendMessage not implemented');
    }
}

module.exports = CommandSender;