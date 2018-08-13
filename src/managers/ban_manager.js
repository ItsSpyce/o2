const sql = require('./../connectors/sql_connector');

function isPlayerBanned(steamId) {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM Bans WHERE steam_id = ' + steamId, (result) => {

        });
    })
}