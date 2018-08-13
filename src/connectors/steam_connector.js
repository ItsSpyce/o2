const O2Connector = require('./../o2_connector');
const SteamAPI = require('steam-api');

let steamApiKey = null;

class SteamConnector extends O2Connector {
    constructor(server) {
        super('steam', server);
        this.onConfig((config) => {
            steamApiKey = config.steam.steam_api_key;
        });
    }

    getPlayerBans(steamId) {
        return new Promise((resolve, reject) => {
            try {
                let user = new SteamAPI.User(steamApiKey, steamId).done((result) => {
                    return resolve(result);
                });
            } catch (ex) {
                return reject(ex);
            }
        });
    }

    getUserStatsForGame(steamId) {
        return new Promise((resolve, reject) => {
            try {
                let userStatus = new SteamAPI.UserStats(steamApiKey, steamId);
                userStats.GetUserStatsForGame('', steamId).done((result) => {
                    return resolve(result);
                })
            } catch (ex) {
                return reject(ex);
            }
        });
    }
}

module.exports = SteamConnector;