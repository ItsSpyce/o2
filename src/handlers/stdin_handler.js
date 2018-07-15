const Command = require('./../command');
const colors = require('colors');
const HelpCommand = require('./../commands/help');
const StopCommand = require('./../commands/stop');

const cmds = {
    help: new HelpCommand(),
    stop: new StopCommand()
};

/**
 * The handler class for any STDIN of the console.
 */
class InputHandler {
    constructor(input, output) {
        input.addListener('data', (e) => {
            const data = e.toString().trim();
            let result = null;
            try {
                result = Command.tryExecute(data, true);
            } catch (ex) {
                result = colors.red(`[ERROR]: ${ex.message}`)
            }
            output.write(result + '\r\n');
        });
    }

    static registerNew(input, output) {
        return new InputHandler(input, output); // todo: keep track of these?
    }
}

module.exports = InputHandler;