#!/usr/bin/env node

import commander from 'commander';
import winston from 'winston';
import { homedir } from 'os';
import { outputJSON } from 'fs-extra';
import { prompt } from 'inquirer';
import { italic, red } from 'chalk';
import { get, map, merge, omit } from 'lodash';

import { inputs } from './questions';
import { optionsFile } from './config';
import { retrieveToken } from './client';

commander
  .option('-v, --verbose', 'Display verbose information')
  .parse(process.argv);

prompt(map(['host', 'username', 'password'], item => get(inputs, item, {})))
  .then(auth =>
    retrieveToken(auth)
      .then(res =>
        outputJSON(`${homedir()}/${optionsFile}`, omit(merge(auth, res), ['password']))))
  .then(() => winston.info(italic('Login successful')))
  .catch((err) => {
    winston.error(red('Impossible to login, use -v (verbose) option to display error'));
    if (commander.verbose) {
      winston.error(err);
    }
    process.exit(1);
  });
