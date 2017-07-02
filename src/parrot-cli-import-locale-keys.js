#!/usr/bin/env node

import commander from 'commander';
import winston from 'winston';
import { prompt } from 'inquirer';
import { red, italic } from 'chalk';
import { isEmpty, merge } from 'lodash';

import { choices } from './questions';
import { retrieveProjectLocales, sendKeys } from './client';
import { startForProject, cleanExitOption } from './utils';

commander
  .option('-v, --verbose', 'Display verbose information')
  .option('-f, --file <file>', 'The file to import')
  .parse(process.argv);

if (isEmpty(commander.file)) {
  cleanExitOption('file', '-f');
}

startForProject(commander.file)
  .then(retrieveProjectLocales)
  .then(({ host, token, data, projectId, locales }) =>
    prompt([choices.locales(locales)])
      .then(({ localeId }) => merge({ host, token, data, projectId }, { localeId })))
  .then(sendKeys)
  .then(() => winston.info(italic('Key to locale addition successful')))
  .catch((err) => {
    winston.error(red('Impossible to add keys, use verbose option to display error'));
    if (commander.verbose) {
      winston.error(err);
    }
    process.exit(1);
  });
