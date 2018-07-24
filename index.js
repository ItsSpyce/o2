// basically just a modification and build off of the base of https://github.com/MarlburroW/rust-commander
const logger = require('./src/logger');
const O2 = require('./src/o2');
const SqlConnector = require('./src/connectors/sql_connector');
const stdin = process.openStdin();

global.isDebugging = process.argv.indexOf('-d') > -1;

const o2 = new O2(process.argv[2] === '-d' ? null : process.argv[2]);
o2.registerConnector(new SqlConnector(o2));
o2.run();
o2.registerInputHandler(process.stdin, process.stdout);