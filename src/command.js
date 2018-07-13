class Command {
    constructor(name, description, level, handler) {
        this.name = name;
        this.description = description;
        this.level = level;
        this.handler = handler;

        Command.registeredCommands[name] = this;
    }
}

Command.registeredCommands = Object.create(null);

Command.tryExecute = function(msgJson) {
    var params = convertStringToParamsArray(msgJson.Message);
}

class CommandExecution {
    constructor(msgJson) {
        
    }
}

function convertStringToParamsArray(input) {
    let isReadingString = false;
    let result = [];
    let currentStep = '';
    let s = input.split(' ');
    // we start at 1 because the first item will always be the command
    for (var i = 1; i < s.length; ++i) {
        var value = s[i];
        if (isReadingString) {
            if (value.endsWith('"')) {
                // we're closing the string
                currentStep += ` ${value.substr(0, value.length - 1)}`;
                isReadingString = false;
            } else {
                currentStep += ` ${value}`;
            }
        } else {
            currentStep = value;
        }
        result.push(currentStep);
    }
    return result;
}