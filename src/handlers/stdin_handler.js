const Command = require('./../command');
const colors = require('colors');
const CommandSender = require('./../cmd_sender');
/**
 * The handler class for any STDIN of the console.
 */
class InputHandler extends CommandSender {
    constructor(o2, input, output) {
        super(input);
        this.o2 = o2;
        this.input = input;
        this.output = output;
        input.addListener('data', (e) => {
            const data = e.toString().trim();
            Command.tryExecute(this, this.o2, data, true, (err, result) => {
                if (err) {
                    this.output.write(colors.red(`[ERROR]: ${err.message}\r\n`));
                    return;
                }
                this.output.write(result + '\r\n');
            });
        });
    }

    /**
     * Sends a message to this handler to be written to the stream.
     * @param {String} msg 
     */
    sendMessage(msg) {
        this.output.write(`${msg}\r\n`);
    }

    /**
     * 
     * @param {O2} o2 The server this handler is bound to.
     * @param {*} input The input stream this handler reads from.
     * @param {*} output The output stream this handler writes to.
     */
    static registerNew(o2, input, output) {
        const handler = new InputHandler(o2, input, output);
        registeredInputs.push(handler);
        return handler;
    }

    /**
     * Gets all registered input handlers.
     * @returns {Array<InputHandler>}
     */
    static get registeredInputs() {
        return registeredInputs;
    }
}

const registeredInputs = [];

module.exports = InputHandler;