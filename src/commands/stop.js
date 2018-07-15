const Command = require('./../command');

class StopCommand extends Command {
    constructor() {
        super('stop', 'Closes the RCON connection', Command.CommandAllowance.NO_RESTRICTION, (reason) => {
            process.kill(0);
        });
    }
}

module.exports = StopCommand;