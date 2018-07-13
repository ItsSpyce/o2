const MessageHandler = require('./../handler');
const MessageType = require('./../utils').MessageType;
const players = require('./../players');
const Player = players.O2Player;

const LEAVE_EVENT_REGEX = players.LEAVE_EVENT_REGEX;
const JOIN_EVENT_REGEX = players.JOIN_EVENT_REGEX;

class PlayerHandler extends MessageHandler {
    constructor(handler) {
        super((msg) => {
            return msg.Type === MessageType.GENERIC && 
                msg.Identifier === 0 && 
                (LEAVE_EVENT_REGEX.test(msg.Message) || JOIN_EVENT_REGEX.test(msg.Message));
        }, (msg) => {

        });
    }
}

module.exports = PlayerHandler;