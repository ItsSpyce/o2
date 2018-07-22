const O2 = require('./o2');
const logger = require('./logger');
const sql = require('./connectors/sql_connector');
const CommandSender = require('./cmd_sender');

const LEAVE_EVENT_REGEX = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?\/(\d+)\/([A-Za-z0-9\s]+)\s(disconnecting):\s(\w+)$/g;
const JOIN_EVENT_REGEX = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?\/(\d+)\/([A-Za-z0-9\s]+)\s(joined)\s\[(windows)\/\3\]$/g;
const PLAYER_KILLED_REGEX = /^((?:\w?\s?\d?)+)\[\d+\/\d+\] was killed by /g;
const PLAYER_SUICIDE_REGEX = /^((?:\w?\s?\d?)+)\[\d+\/\d+\] was suicide by Suicide$/g;

function getOnlinePlayers(handler) {
    if (!handler) return;
    if (!O2.instance) return [];
    O2.instance.rcon.sendMessage('playerlist').then((result) => {
        handler(null, result.map(O2Player.fromPlayerList));
    }, (err) => {
        handler(err);
    });
}

function getAllPlayers() {
    
}

/**
 * A wrapper around a rust player.
 */
class O2Player extends CommandSender {
    constructor(options) {
        super(this);
        this.steamId = options.steamId;
        this.ip = options.ip;
        this.name = options.name;
        this.ping = options.ping;
        this.connectedSeconds = options.connectedSeconds;
        this.voiationLevel = options.voiationLevel;
        this.currentLevel = options.currentLevel;
        this.unspentXp = options.unspentXp;
        this.health = options.health;
        this.commandLevel = options.commandLevel;
    }

    sendMessage(msg) {
        // for now, there's no way to PM a player, so we'll have to broadcast it. This means admins need to be careful.
        O2.instance.sendMessage(msg);
    }

    /**
     * Converts a join message input into a player.
     * @param {String} joinMessage 
     * @returns {O2Player}
     */
    static fromJoinData(joinMessage) {
        var data = JOIN_EVENT_REGEX.exec(joinMessage);
        if (data.length === 0) {
            logger.error(`[PLAYER/JOIN]: Failed to parse join message to player data`);
            return null;
        }
    }

    static fromPlayerList(playerListEntry) {
        let player = new O2Player({
            steamId: playerListEntry.SteamID,
            ip: playerListEntry.Address,
            name: playerListEntry.DisplayName,
            ping: playerListEntry.Ping,
            connectedSeconds: playerListEntry.ConnectedSeconds,
            voiationLevel: playerListEntry.voiationLevel,
            currentLevel: playerListEntry.CurrentLevel,
            unspentXp: playerListEntry.UnspentXp,
            health: playerListEntry.Health
        });

        return player;
    }
}

module.exports = {
    O2Player,
    getOnlinePlayers,
    getAllPlayers,
    LEAVE_EVENT_REGEX,
    JOIN_EVENT_REGEX,
    PLAYER_KILLED_REGEX,
    PLAYER_SUICIDE_REGEX
}