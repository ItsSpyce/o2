const Command = require('./../command');
const sql = require('./../connectors/sql_connector');
const colors = require('colors');

class SqlCommand extends Command {
    constructor() {
        super('sql', 'Executes a SQL query in the server', Command.CommandAllowance.SERVER_ONLY, (sender, server, ...args) => {
            return new Promise((resolve, reject) => {
                const query = args.join(' ');
                if (!query || query.length === 0) {
                    return resolve(`Current SQL status: ${sql.isConnected ? 'CONNECTED' : 'DISCONNECTED'}`);
                }
                sql.query(query, (error, results, fields) => {
                    server.sendMessage(colors.italic(colors.blue(`=> ${query}`)));
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(results);
                    }
                });
            });
        });
    }
}

module.exports = SqlCommand;