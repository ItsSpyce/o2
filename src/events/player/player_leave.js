const PlayerEvent = require('./player_event');
const LEAVE_REGEX = require('./../../players').LEAVE_EVENT_REGEX;

class PlayerLeaveEvent extends PlayerEvent {
    constructor(event) {
        super(event);
    }
}

module.exports = PlayerLeaveEvent;