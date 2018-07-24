const MessageHandler = require('./../handler');
const MessageType = require('./../utils').MessageType;
const players = require('./../players');
const Player = players.O2Player;

const LEAVE_EVENT_REGEX = players.LEAVE_EVENT_REGEX;
const JOIN_EVENT_REGEX = players.JOIN_EVENT_REGEX;

class PlayerHandler extends MessageHandler {
    constructor(check, handler) {
        super((msg) => {
            return msg.Type === MessageType.GENERIC && msg.Identifier === 0 && check(msg) === true;
        }, (msg) => {

        });
    }

    static get LEAVE_EVENT_REGEX() {
        return LEAVE_EVENT_REGEX;
    }

    static get JOIN_EVENT_REGEX() {
        return JOIN_EVENT_REGEX;
    }
}

module.exports = PlayerHandler;