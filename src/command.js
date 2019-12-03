const config = require('./config.json');
const Raven = require("raven");

Raven.config(config.sentryDSN).install();

const argv = require('minimist')(process.argv.slice(2));
const argc = argv._.length;
if(argc !== 2 || argv._[0] !== 'run') {
  console.error('Invalid signature. Use node command.js run {command}');
  process.exit(-1);
}

require('./commands/' + argv._[1])(function(err) {
  if(err) {
    console.error(err);
    Raven.captureException(err);
    process.exit(-1);
  }
  process.exit(0);
});
