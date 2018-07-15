const utils = require('./utils');
const logger = require('./logger');

const registeredCommands = Object.create(null);
const CommandAllowance = {
    PLAYER_ONLY: 0,
    SERVER_ONLY: 1,
    NO_RESTRICTION: -1
}

class Command {
    static get registeredCommands() {
        return registeredCommands;
    }

    static get CommandAllowance() {
        return CommandAllowance;
    }

    constructor(name, description, cmdAllowance, level, handler) {
        this.$$o2Command = true;
        this.name = name;
        this.description = description;
        this.cmdAllowance = cmdAllowance;
        if (typeof level === 'function') {
            handler = level;
            level = 0;
        }
        this.level = level;
        this.handler = handler;

        Command.registeredCommands[name] = this;
    }

    register() {
        registeredCommands[this.name] = this;
        logger.success('[CMD/INFO]: Successfully registered command ' + this.name);
    }

    static tryExecute(server, input, isFromStdin) {
        var params = utils.convertStringToParamsArray(input);
        params.unshift(server);
        var name = params[1];
        var cmd = registeredCommands[name];
        if (!cmd) throw new Error(`command '${name}' doesn't exist`);
        if (isFromStdin && cmd.cmdAllowance === CommandAllowance.PLAYER_ONLY) {
            throw new Error(`this command can only be used in game`);
        } else if (!isFromStdin && cmd.cmdAllowance === CommandAllowance.SERVER_ONLY) {
            throw new Error(`this command can only be used from a console`);
        }
        let result = cmd.handler(params.slice(1));
        if (result === undefined) result = '';
        return result.toString();
    }
}

class CommandExecution {
    constructor(msgJson) {
        
    }
}

module.exports = Command;