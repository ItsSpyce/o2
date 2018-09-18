const Command = require('./../command');
const players = require('./../players');

class LevelCommand extends Command {
    constructor() {
        super('level', 'Gets or sets a player\'s level', Command.CommandAllowance.NO_RESTRICTION, (sender, server, ...args) => {
            return new Promise((resolve, reject) => {
                if (sender.level && sender.level < 20) {
                    return reject("You don't have permission to use that!");
                }
                if (args.length === 0) {
                    // we're getting the level of the current player
                    return resolve(`${sender.playerName} has the clearance level ${sender.level}.`);
                }
                const playername = args[0];
                if (!playername) {
                    return reject(); // fail quietly
                }
                const player = players.getPlayerFromName(playername);
                if (!player) {
                    return reject('Could not find a player with that name.');
                }
                if (args[1]) {
                    const level = parseInt(args[1]);
                    if (level == NaN) {
                        return reject('An invalid level was passed.');
                    }
                    player.level = level;
                    player.save();
                }
                return resolve(`${player.playerName} clearance level: ${player.level}.`);
            });
        });
    }
}

module.exports = LevelCommand;