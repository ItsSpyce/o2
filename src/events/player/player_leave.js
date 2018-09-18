const PlayerEvent = require('./player_event');
const LEAVE_REGEX = require('./../../players').LEAVE_EVENT_REGEX;

class PlayerLeaveEvent extends PlayerEvent {
    constructor(event) {
        super(event);
        const data = LEAVE_REGEX.exec(this._rconMessage);
        this.username = data[3];
    }
}

module.exports = PlayerLeaveEvent;