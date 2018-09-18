const Command = require('./../command');
const players = require('./../players');

class KickCommand extends Command {
    constructor() {
        super('kick', 'Kicks a player from the server', Command.CommandAllowance.NO_RESTRICTION, 40, (sender, server, ...args) => {
            return new Promise((resolve, reject) => {
                if (args.length === 0) return reject('No player was specified!');
                if (isNaN(args[0])) {
                    players.getPlayer(args[0]).then((player) => {
                        player.isOnline().then((isOnline) => {
                            if (isOnline) {
                                // kick
                                
                                resolve();
                            } else {
                                return reject('That player is not online!');
                            }
                        })
                    })
                } else {
                    players.getPlayerFromName(args[0]).then((player) => {
                        player.isOnline().then((isOnline) => {
                            if (isOnline) {
                                // kick
                            } else {
                                return reject('That player is not online!');
                            }
                        })
                    })
                }
                
            })
        });
    }
}