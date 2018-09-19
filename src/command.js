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
        logger.success('Successfully registered command ' + this.name);
    }

    /**
     * 
     * @param {*} sender 
     * @param {*} server 
     * @param {String} input 
     * @param {Boolean} isFromStdin 
     * @param {(sender, server, args: Array<*>) => void|Promise<*>} handler 
     */
    static async tryExecute(sender, server, input, isFromStdin, handler) {
        if (!input || input.length === 0) {
            handler(null, '');
            return;
        }
        if (sender.$isInputStream === undefined) sender.$isInputStream = isFromStdin;
        var params = utils.convertStringToParamsArray(input);
        var name = params[0];
        var cmd = registeredCommands[name];
        if (!cmd) {
            handler(new Error(`command '${name}' doesn't exist`));
            return;
        }
        if (!isFromStdin && sender.level < cmd.level) {
            return;
        }
        if (isFromStdin && cmd.cmdAllowance === CommandAllowance.PLAYER_ONLY) {
            handler(new Error(`this command can only be used in game`));
            return;
        } else if (!isFromStdin && cmd.cmdAllowance === CommandAllowance.SERVER_ONLY) {
            handler(new Error(`This command can only be used from a console`));
            return;
        }
        params[0] = server;
        params.unshift(sender);
        let result = await cmd.handler.apply(null, params);
        if (result instanceof Promise) {
            result.then((value) => {
                handler(null, value);
            }).catch((reason) => {
                handler(reason, null);
            });
        }
        else if (result === undefined) {
            result = '';
        } else {
            handler(null, result);
        }
    }
}

class CommandExecution {
    constructor(msgJson) {
        
    }
}

module.exports = Command;