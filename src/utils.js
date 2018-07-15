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
    for (var i = 0; i < s.length; ++i) {
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

module.exports = {
    VERSION,
    AUTHOR,
    MessageType,
    convertStringToParamsArray
}