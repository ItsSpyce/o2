const fs = require('fs');

const VERSION = '0.0.1';
const AUTHOR = 'Conji';
const MessageType = {
    CHAT: 'Chat',
    GENERIC: 'Generic'
};

function convertStringToParamsArray(input) {
    let isReadingString = false;
    let result = [];
    let currentStep = '';
    let s = input.split(' ');
    for (let i = 0; i < s.length; ++i) {
        var value = s[i];
        if (!isReadingString) {
            if (value[0] === '"') {
                currentStep = value.substr(1);
                isReadingString = true;
            } else {
                result.push(value);
            }
        } else {
            if (value.endsWith('"')) {
                currentStep += ` ${value.substr(0, value.length - 1)}`;
                result.push(currentStep);
                isReadingString = false;
            } else {
                currentStep += ` ${value}`;
            }
        }
    }
    return result;
}

function readdirdeep(dir) {
    let results = [];
    fs.readdirSync(dir).forEach((file) => {
        file = `${dir}/${file}`;
        let stat = fs.lstatSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(readdirdeep(file));
        } else {
            results.push(file);
        }
    });

    return results;
}

module.exports = {
    VERSION,
    AUTHOR,
    MessageType,
    convertStringToParamsArray,
    readdirdeep
}