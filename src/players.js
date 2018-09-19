const logger = require('./logger');
const sql = require('./connectors/sql_connector');
const CommandSender = require('./cmd_sender');
const dateFns = require('date-fns');

const LEAVE_EVENT_REGEX = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})?\/(\d+)\/([A-Za-z0-9\s]+)\s(disconnecting):\s(\w+)$/i;
const JOIN_EVENT_REGEX = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})?\/(\d+)\/([A-Za-z0-9\s]+)\s(joined)\s\[(windows)\/\3\]$/i;
const PLAYER_KILLED_REGEX = /^((?:\w?\s?\d?)+)\[\d+\/\d+\] was killed by /g;
const PLAYER_SUICIDE_REGEX = /^((?:\w?\s?\d?)+)\[\d+\/\d+\] was suicide by Suicide$/g;

/**
 * A wrapper around a rust player.
 */
class O2Player extends CommandSender {
    /**
     * 
     * @param {{steamId:String,ip:String,name:String,ping:Number,connectedSeconds:Number,voiationLevel:Number,currentLevel:Number,unspentXp:Number,health:Number,level:Number}} options 
     */
    constructor(options) {
        super(null, false);
        this.steamId = options.steamId;
        this.ip = options.ip;
        this.name = options.name;
        this.ping = options.ping;
        this.connectedSeconds = options.connectedSeconds;
        this.voiationLevel = options.voiationLevel;
        this.currentLevel = options.currentLevel;
        this.unspentXp = options.unspentXp;
        this.health = options.health;
        this.level = options.level || 0;
    }

    /**
     * 
     * @param {String} msg The message to broadcast
     */
    sendMessage(msg) {
        // for now, there's no way to PM a player, so we'll have to broadcast it. This means admins need to be careful.
        O2.instance.sendMessage(`To ${this.name}: ${msg}`);
    }

    save() {
        sql.query(`UPDATE Players WHERE SteamID = ${this.steamId}`, (err, result, fields) => {
            if (err) {
                logger.error(`An error occured when saving player ${this.name}: ${err}`);
            }
        });
    }

    saveNew() {
        sql.query(`INSERT INTO Players (SteamID, PlayerName, Level) VALUES (${this.steamId}, ${this.playerName}, ${this.level})`, (err, result, fields) => {
            if (err) {
                logger.error(`An error occured when inserting player ${this.name}: ${err}`);
            }
        });
    }

    isOnline(server) {
        return new Promise((resolve, reject) => {
            O2Player.getOnlinePlayers(server).then((players) => {
                return resolve(players.map((p) => { return p.steamId }).indexOf(this.steamId) > -1);
            }, (err) => {
                return reject(err);
            });
        });
    }

    /**
     * 
     * @param {*} server 
     * @param {CommandSender} sender 
     * @param {String} reason 
     */
    kick(server, sender, reason) {
        return new Promise((resolve, reject) => {
            server.rcon.sendCommand(`kick "${this.steamId}" "${reason.toString()}"`).then((result) => {
                sql.query(`INSERT INTO Kicks (SteamID, KickedByID, Reason, EnforcedOn) VALUES (${this.steamId}, ${sender.steamId || 'SERVER'}, ${reason}, ${Date.now()})`);
                return resolve();
            }, (err) => {
                return reject('Failed to kick player: ' + err);
            });
        });
    }

    /**
     * 
     * @param {*} server 
     * @param {CommandSender} sender 
     * @param {String} reason 
     * @param {Number} duration
     * @param {Boolean} overwriteActiveBan 
     */
    ban(server, sender, reason, duration, overwriteActiveBan = false) {
        return new Promise((resolve, reject) => {
            if (duration <= 0) return reject('Duration must be positive');
            sql.query(`SELECT * FROM Bans WHERE SteamID = ${this.steamId}`, (err, result, fields) => {
                if (err) return reject(err);
                result.forEach((r) => {
                    let enforcedOn = new Date(r.EnforcedOn);
                    let endsOn = dateFns.addMinutes(enforcedOn, r.Duration);
                    if (dateFns.isAfter(endsOn, Date.now())) {
                        if (!overwriteActiveBan) {
                            return reject('This player currently has an active ban');
                        } else {
                            sql.query(`DELETE FROM Bans WHERE EnforcedOn = ${r.EnforcedOn}`);
                        }
                    }
                });
                sql.query(`INSERT INTO Bans (SteamID, BannedByID, Reason, EnforcedOn, Duration) VALUES (${this.steamId}, ${sender.$isInputStream ? 'CONSOLE' : sender.steamId}, ${reason}, ${Date.now()}, ${duration})`);
                server.rcon.sendCommand(`kick "${this.steamId}" "${reason.toString()}"`).then((result) => {
                    return resolve(`Banned ${this.name} for: ${reason}`);
                }, (err) => {
                    return reject(`Failed to ban user ${this.name}:\r\n${err}`);
                });
            })
            
        })
    }

    /**
     * 
     * @param {*} server 
     * @param {CommandSender} sender 
     */
    unban(server, sender) {
        return new Promise((resolve, reject) => {
            sql.query(`DELETE FROM Bans WHERE SteamID = ${this.steamId}`).then((result) => {
                return resolve('User unbanned');
            }, (err) => {
                return reject(err);
            });
        });
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

    static getOnlinePlayers(server) {
        return new Promise((resolve, reject) => {
            if (!server) return [];
            server.rcon.sendCommand('playerlist').then((result) => {
                let json = JSON.parse(result);
                return resolve(json.map(O2Player.fromPlayerList));
            }, (err) => {
                return reject(err);
            });
        })
    }
    
    /**
     * 
     * @param {CommandSender} sender 
     */
    static getAllPlayers(sender) {
        sql.query('SELECT * FROM Players', (err, result, fields) => {
            if (err) {
                sender.sendMessage(`Failed to retrieve full player list: ${err}`);
                return;
            }
            return result;
        });
    }
    
    /**
     * 
     * @param {Number} steamId 
     * @returns {Promise<O2Player>}
     */
    static getPlayer(steamId) {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM Players WHERE SteamID = ${steamId}`, (err, result, fields) => {
                if (err) {
                    return reject(err);
                }
                return resolve(new O2Player({ steamId, name: result.PlayerName, level: result.Level }));
            });
        });
    }

    /**
     * 
     * @param {String} name 
     * @returns {Promise<O2Player>}
     */
    static getPlayerFromName(name) {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM Players WHERE PlayerName CONTAINS ${name}`, (err, result, fields) => {
                if (err) {
                    return reject(err);
                }
                if (Array.isArray(result)) result = result[0];
                return resolve(new O2Player({ steamId: result.SteamID, name: result.PlayerName, level: result.Level }));
            });
        });
    }
}

module.exports = O2Player;
module.exports.JOIN_EVENT_REGEX = JOIN_EVENT_REGEX;
module.exports.LEAVE_EVENT_REGEX = LEAVE_EVENT_REGEX;
module.exports.PLAYER_KILLED_REGEX = PLAYER_KILLED_REGEX;
module.exports.PLAYER_SUICIDE_REGEX = PLAYER_SUICIDE_REGEX;