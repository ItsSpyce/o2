const Command = require('./../command');

class RawCommand extends Command {
    constructor() {
        super('raw', 'Executes a raw RCON command against the server', Command.CommandAllowance.SERVER_ONLY, (sender, server, ...args) => {
            return new Promise((resolve, reject) => {
                try {
                    server.rcon.sendCommand(args.join(' ')).then((result) => {
                        resolve(result);
                    }, (err) => {
                        reject(err);
                    });
                } catch (ex) {
                    reject(ex);
                }
            });
        });
    }
}

module.exports = RawCommand;