#!/usr/bin/env node

import commander from 'commander';
import winston from 'winston';
import { prompt } from 'inquirer';
import { homedir } from 'os';
import { remove } from 'fs-extra';
import { red } from 'chalk';

import { optionsFile } from './config';

commander
  .option('-v, --verbose', 'Display verbose information')
  .parse(process.argv);

prompt([{
  type: 'confirm',
  name: 'confirm',
  message: 'Are you sure ?'
}])
  .then(({ confirm }) => {
    if (confirm) {
      return remove(`${homedir()}/${optionsFile}`);
    }
    return true;
  })
  .then(() => winston.info('Logout successful'))
  .catch((err) => {
    winston.error(red('Impossible to logout, use -v (verbose) option to display error'));
    if (commander.verbose) {
      winston.error(err);
    }
    process.exit(1);
  });
