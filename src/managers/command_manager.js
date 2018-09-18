const Command = require('./../command');
const fs = require('fs');
const utils = require('./../utils');
const logger = require('./../logger');

const HelpCmd = require('./../commands/help');
const PingCmd = require('./../commands/ping');
const StopCmd = require('./../commands/stop');
const SqlCmd = require('./../commands/sql');
const PlayersCmd = require('./../commands/players');
const SayCmd = require('./../commands/say');
const RawCmd = require('./../commands/raw');
const LevelCmd = require('./../commands/level');

let instancedCommands = [];

class CommandManager {
    registerCommands() {
        instancedCommands = [
            new HelpCmd(),
            new PingCmd(),
            new StopCmd(),
            new SqlCmd(),
            new PlayersCmd(),
            new SayCmd(),
            new RawCmd(),
            new LevelCmd()
        ];
    }

    registerCommand(cmd) {
        if (!cmd.$$o2Command) throw new Error('Invalid command attempting to be registered. Please inherit from Command.');
        instancedCommands.push(cmd);
    }
}

module.exports = CommandManager;