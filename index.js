// basically just a modification and build off of the base of https://github.com/MarlburroW/rust-commander
const logger = require('./src/logger');
const O2 = require('./src/o2');

const o2 = new O2(process.argv[2]);
o2.run();