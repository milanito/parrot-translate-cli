import commander from 'commander';
import winston from 'winston';
import { homedir } from 'os';
import { readJSON } from 'fs-extra';
import { bold, italic, red } from 'chalk';

import { optionsFile } from './config';

commander
  .option('-v, --verbose', 'Display verbose information')
  .parse(process.argv);

readJSON(`${homedir()}/${optionsFile}`)
  .then(({ host, username }) => {
    winston.info(bold('Host ', italic(host)));
    winston.info(bold('Email ', italic(username)));
  })
  .catch((err) => {
    winston.error(red('Impossible to display informations, are you sure you are logged in ?'));
    if (commander.verbose) {
      winston.error(err);
    }
    process.exit(1);
  });
