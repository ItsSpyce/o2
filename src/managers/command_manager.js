const Command = require('./../command');
const fs = require('fs');
const utils = require('./../utils');
const logger = require('./../logger');

const HelpCmd = require('./../commands/help');
const PingCmd = require('./../commands/ping');
const StopCmd = require('./../commands/stop');

let instancedCommands = [];

class CommandManager {
    registerCommands() {
        instancedCommands = [
            new HelpCmd(),
            new PingCmd(),
            new StopCmd()
        ];
    }

    registerCommand(cmd) {
        if (!cmd.$$o2Command) throw new Error('Invalid command registered');
        instancedCommands.push(cmd);
    }
}

module.exports = CommandManager;