class CommandSender {
    constructor(base, isInputStream) {
        this.$base = base;
        this.$isInputStream = isInputStream;
    }

    sendMessage(msg) {
        throw new Error('sendMessage not implemented');
    }
}

module.exports = CommandSender;