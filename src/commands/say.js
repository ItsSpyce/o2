const Command = require('./../command');

class SayCommand extends Command {
    constructor() {
        super('say', 'Outputs a message to in-game chat', Command.CommandAllowance.SERVER_ONLY, (sender, server, ...args) => {
            const msg = args.join(' ');
            server.rcon.sendMessage(msg);
        });
    }
}

module.exports = SayCommand;