const Command = require('./../command');

class PingCommand extends Command {
    constructor() {
        super('ping', 'Pings the server', Command.CommandAllowance.NO_RESTRICTION, (sender, server) => {
            return new Promise((resolve, reject) => {
                try {
                    server.rcon.sendCommand('env.time').then((result) => {
                        resolve('Pong!');
                    }, (err) => {
                        reject(err);
                    });
                } catch (ex) {
                    reject(ex);
                }
            });
        })
    }
}

module.exports = PingCommand;