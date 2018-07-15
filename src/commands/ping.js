const Command = require('./../command');

class PingCommand extends Command {
    constructor() {
        super('ping', 'Pings the server', Command.CommandAllowance.NO_RESTRICTION, (server) => {
            
        })
    }
}

module.exports = PingCommand;