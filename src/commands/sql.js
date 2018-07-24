const Command = require('./../command');
const sql = require('./../connectors/sql_connector');
const colors = require('colors');

class SqlCommand extends Command {
    constructor() {
        super('sql', 'Executes a SQL query in the server', Command.CommandAllowance.SERVER_ONLY, (sender, server, ...args) => {
            const query = args.join(' ');
            if (!query || query.length === 0) {
                return `Current SQL status: ${sql.isConnected ? 'CONNECTED' : 'DISCONNECTED'}`;
            }
            sql.execute(query, (error, results, fields) => {
                server.sendMessage(colors.italic(colors.blue(`=> ${query}`)));
                if (error) {
                    server.sendError(error.toString());
                } else {
                    return results;
                }
            });
        })
    }
}

module.exports = SqlCommand;