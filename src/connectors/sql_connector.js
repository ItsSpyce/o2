const sql = require('mssql');
const logger = require('./../logger');

let user = null;
let password = null;
let server = null;
let database = null;

let pool = null;

async function config(options) {
    logger.log(options);
    user = options.user;
    password = options.password;
    server = options.server;
    database = options.database;

    pool = new sql.ConnectionPool({
        user,
        password,
        server,
        database,
        parseJSON: true
    });
    pool = await sql.connect(`mssql://${options.user}:${options.password}@${options.server}/${options.database}?encrypt=true&driver=msnodesqlv8`, (err) => {
        logger.title('SQL');    
        if (err) {
            logger.error(`[CONFIG/SQL]: Failed to connect to SQL: ${err}`);
        } else {
            logger.success('[CONFIG/SQL]: Successfully connected to SQL');
        }
    });
}

function execute(cmd, callback) {
    if (!pool) throw new Error('config must be called before connecting to SQL');
    const request = pool.request();
    request.query(cmd, callback);
}

module.exports = {
    config,
    execute
}