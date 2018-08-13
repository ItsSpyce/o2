const PlayerEvent = require('./player_event');

class PlayerChatEvent extends PlayerEvent {
    constructor(msg) {
        super(msg);
        this.message = msg.Message;
        this.userId = msg.UserId;
        this.username = msg.Username;
        this.color = msg.Color;
        this.time = msg.Time;
    }
}

module.exports = PlayerChatEvent;