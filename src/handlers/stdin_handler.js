const Command = require('./../command');
const colors = require('colors');
/**
 * The handler class for any STDIN of the console.
 */
class InputHandler {
    constructor(o2, input, output) {
        this.o2 = o2;
        input.addListener('data', (e) => {
            const data = e.toString().trim();
            let result = null;
            try {
                result = Command.tryExecute(this.o2, data, true);
            } catch (ex) {
                result = colors.red(`[ERROR]: ${ex.message}`)
            }
            output.write(result + '\r\n');
        });
    }

    static registerNew(o2, input, output) {
        return new InputHandler(o2, input, output); // todo: keep track of these?
    }
}

module.exports = InputHandler;