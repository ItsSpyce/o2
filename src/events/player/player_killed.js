const PlayerEvent = require('./player_event');
const Players = require('./../../players');

class PlayerKilledEvent extends PlayerEvent {
    constructor(event, wasSuicide) {
        super(event);
        this.wasSuicide = wasSuicide || false;
        if (wasSuicide) {
            const data = Players.PLAYER_SUICIDE_REGEX.exec(event);
            this.player = data[0];
        }
    }
}

module.exports = PlayerKilledEvent;