const sql = require('mysql');
const logger = require('./../logger');

let connection = null;
let connected = false;

function config(options) {
    connection = sql.createConnection({
        host: options.host,
        user: options.user,
        password: options.password,
        database: options.db
    });
    try {
        logger.title('SQL');
        connection.connect();
        connected = true;
        logger.success('[CONFIG/SQL]: Successfully connected to SQL database');
    } catch (e) {
        logger.error('[CONFIG/SQL]: Failed to connect to SQL: ' + e);
    }
}

function execute(cmd, callback) {
    if (!connected) throw new Error('.config must be called before executing a query');
    connection.query(cmd, callback);
}

module.exports = {
    config,
    execute
}