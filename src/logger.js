const colors = require('colors');
const utils = require('./utils');

function log(log) {
    console.log(log);
}

function error(log) {
    console.log(colors.red(log));
}

function success(log) {
    console.log(colors.green(log));
}

function debug(log) {
    if (global.isDebugging) console.log(colors.magenta(`[DEBUG]: ${log}`));
}

function title(title) {
    const length = title.length;
    const lineLength = Math.floor((30 - (length + 2)) / 2);
    console.log('');
    console.log(`=> ${colors.yellow(title)}`);
    console.log('');
}

function splashScreen() {
    log(colors.cyan('========================================='));
    log(colors.cyan(`O2 v${utils.VERSION}`));
    log(colors.cyan('An admin tool for Rust running on NodeJS.'));
    log(colors.cyan(`Author: ${utils.AUTHOR}`));
    log(colors.cyan('========================================='));
}

module.exports = {
    log, 
    error,
    success,
    debug,
    title,
    splashScreen
}