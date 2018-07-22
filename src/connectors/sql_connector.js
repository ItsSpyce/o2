const sql = require('mysql');
const logger = require('./../logger');
const utils = require('./../utils');
const fs = require('fs');

const O2Connector = require('./../o2_connector');

let instance = null;
let isConnected = false;

class SqlConnector extends O2Connector {
    constructor() {
        super('sql');
        instance = this;
        this.onConfig((config) => {
            const options = config.sql_server;
            this.connection = sql.createConnection({
                host: options.host,
                user: options.user,
                password: options.password,
                database: options.db
            });
            try {
                logger.title('SQL');
                this.connection.connect();
                logger.success('[CONFIG/SQL]: Successfully connected to SQL database');
                logger.log('[CONFIG/SQL]: Running SQL startup scripts');
                let sqlScripts = options.startup_scripts;
                sqlScripts.forEach((script) => {
                    let contents = fs.readFileSync(script).toString().replace('\r\n', '');
                    this.connection.query(contents, (error, results, fields) => {
                        if (error) {
                            logger.error(`[CONFIG/SQL]: An error occured at <${script}>: ${error}`);
                        }
                    });
                });
                isConnected = true;
            } catch (e) {
                logger.error('[CONFIG/SQL]: Failed to connect to SQL: ' + e);
                this.connection.end();
            }
        });
    }

    static get isConnected() {
        return isConnected;
    }

    static config(options) {
        if (!instance) throw new Error('no SQL connector has been initialized');
        instance.config(options);
    }

    static execute(cmd, callback) {
        instance.connection.query(cmd, callback);
    }
}

module.exports = SqlConnector;