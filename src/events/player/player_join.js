const PlayerEvent = require('./player_event');
const Player = require('./../../players');

class PlayerJoinEvent extends PlayerEvent {
    constructor(event) {
        super(event);
        const data = Player.JOIN_EVENT_REGEX.exec(this._rconMessage);
        this.username = data[3];
    }
}

module.exports = PlayerJoinEvent;