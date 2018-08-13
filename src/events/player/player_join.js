const PlayerEvent = require('./player_event');
const JOIN_REGEX = require('./../../players').JOIN_EVENT_REGEX;

class PlayerJoinEvent extends PlayerEvent {
    constructor(event) {
        super(event);
        const data = JOIN_REGEX.exec(event);
        this.ip = data[0];
        this.port = data[1];
        this.username = data[2];
        this.platform = data[3];
    }
}

module.exports = PlayerJoinEvent;