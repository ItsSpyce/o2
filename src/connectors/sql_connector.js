const sql = require('mysql');
const logger = require('./../logger');

let connection = null;

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
        logger.success('[CONFIG/SQL]: Successfully connected to SQL database');
        connection.end();
    } catch (e) {
        logger.error('[CONFIG/SQL]: Failed to connect to SQL: ' + e);
    }
}

function execute(cmd, callback) {
    connection.connect();
    connection.query(cmd, callback);
    connection.end();
}

module.exports = {
    config,
    execute
}