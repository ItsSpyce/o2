class ChatEvent {
    constructor(msg) {
        this.message = msg.Message.Message;
        this.userId = msg.Message.UserId;
        this.username = msg.Message.Username;
        this.color = msg.Message.Color;
        this.time = msg.Message.Time;
    }
}

module.exports = ChatEvent;