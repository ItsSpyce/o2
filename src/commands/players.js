const Command = require('./../command');
const players = require('./../players');

class PlayerCommand extends Command {
    constructor() {
        super('players', 'Gets all online players', Command.CommandAllowance.NO_RESTRICTION, 0, (sender) => {
            players.getOnlinePlayers((players) => {
                if (sender) sender.sendMessage(players);
            });
        });
    }
}

module.exports = PlayerCommand;