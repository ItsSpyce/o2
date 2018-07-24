const sql = require('mysql');
const logger = require('./../logger');
const utils = require('./../utils');
const fs = require('fs');

const O2Connector = require('./../o2_connector');

let instance = null;
let isConnected = false;

class SqlConnector extends O2Connector {
    constructor(server) {
        super('sql', server);
        instance = this;
        this.onConfig((config) => {
            const options = config.sql_server;
            this.pool = sql.createPool({
                connectionLimit: 10,
                host: options.host,
                user: options.user,
                password: options.password,
                database: options.db
            });
            this.pool.getConnection((err, connection) => {
                if (err) {
                    server.sendError(`Failed to connect to SQL: ${err}`);
                    return;
                }
                server.sendMessage('Successfully connected to SQL database');
                server.sendMessage('Running SQL startup scripts');
                let sqlScripts = options.startup_scripts;
                sqlScripts.forEach((script) => {
                    let contents = fs.readFileSync(script).toString().replace('\r\n', ' ');
                    connection.query(contents, (error, results, fields) => {
                        if (error) {
                            server.sendError(`An error occured initializing SQL script <${script}>: ${error}`);
                        }

                    });
                });
                connection.release();
                isConnected = true;
            });
        });
    }

    static get isConnected() {
        return isConnected;
    }

    static config(options) {
        if (!instance) throw new Error('no SQL connector has been initialized');
        instance.config(options);
    }

    static query(cmd, callback) {
        instance.pool.query(cmd, callback);
    }
}

module.exports = SqlConnector;