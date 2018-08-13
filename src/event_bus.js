const EventEmitter = require('events').EventEmitter;
const MessageType = require('./utils').MessageType;
const Player = require('./players');
const logger = require('./logger');

// Player events
const PlayerChatEvent = require('./events/player/player_chat');
const PlayerJoinEvent = require('./events/player/player_join');
const PlayerLeaveEvent = require('./events/player/player_leave');
const PlayerKilledEvent = require('./events/player/player_killed');

class EventBus extends EventEmitter {
    initialize(o2) {
        // this is where we setup the RCON message handler
        const rcon = o2.rcon;
        rcon.on('data', (msg) => {
            logger.debug(msg);
            if (Player.JOIN_EVENT_REGEX.test(msg)) {
                let args = new PlayerJoinEvent(msg);
                this.emit('playerJoin', args);
                o2.sendMessage(JSON.stringify(args));
                return;
            }
            if (Player.LEAVE_EVENT_REGEX.test(msg)) {
                let args = new PlayerLeaveEvent(msg);
                this.emit('playerQuit', args);
                o2.sendMessage(msg);
                return;
            }
            if (Player.PLAYER_KILLED_REGEX.test(msg)) {
                let args = new PlayerKilledEvent(msg, false)
                this.emit('playerKilled', args);
                o2.sendMessage(msg);
                return;
            }
            if (Player.PLAYER_SUICIDE_REGEX.test(msg)) {
                let args = new PlayerKilledEvent(msg, true)
                this.emit('playerSuicided', args);
                o2.sendMessage(msg);
                return;
            }
            //o2.sendMessage(`[SERVER/INFO] ${msg.toString()}`);
        });
        rcon.on('chat-message', (msg) => {
            var args = new PlayerChatEvent(msg);
            if (args.message[0] === '!') {
                this.emit('command', args);
            }
            this.emit('playerChat', args);
        });
    }
}

module.exports = EventBus;