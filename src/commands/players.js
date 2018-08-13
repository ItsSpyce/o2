const Command = require('./../command');
const players = require('./../players');

class PlayerCommand extends Command {
    constructor() {
        super('players', 'Gets all online players. Use "-c" to get only the count and "-sid" to get their steam IDs as well.', Command.CommandAllowance.NO_RESTRICTION, 0, (sender, server, ...args) => {
            return new Promise((resolve, reject) => {
                players.getOnlinePlayers(server, (err, players) => {
                    if (err) {
                        return reject(err);
                    }
                    if (args.indexOf('-c') > -1) {
                        return resolve(`${players.length} player${players.length === 1 ? ' is' : 's are'} online`);
                    }
                    return resolve(`${players.length} player${players.length === 1 ? ' is' : 's are'} online\r\n` + players.map((p) => {
                        return `- ${args.indexOf('-sid') > -1 ? `<${p.steamId}> ` : ''}${p.name}`;
                    }).join('\r\n'));
                });
            })
        });
    }
}

module.exports = PlayerCommand;