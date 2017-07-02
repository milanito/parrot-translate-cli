#!/usr/bin/env node

import Promise from 'bluebird';
import commander from 'commander';
import winston from 'winston';
import { red, italic } from 'chalk';
import {
  isEmpty, keys, chunk, merge
} from 'lodash';

import { chunkSize } from './config';
import { addKeys } from './client';
import { startForProject, cleanExitOption } from './utils';

const _chunkKeys = ({ token, data, host, projectId }) =>
  new Promise(resolve => resolve(merge({ token, host, projectId }, {
    ks: chunk(keys(data), chunkSize)
  })));

commander
  .option('-v, --verbose', 'Display verbose information')
  .option('-f, --file <file>', 'The file to import')
  .parse(process.argv);

if (isEmpty(commander.file)) {
  cleanExitOption('file', '-f');
}

startForProject(commander.file)
  .then(_chunkKeys)
  .then(addKeys)
  .then(() => winston.info(italic('Key addition successful')))
  .catch((err) => {
    winston.error(red('Impossible to add keys, use verbose option to display error'));
    if (commander.verbose) {
      winston.error(err);
    }
    process.exit(1);
  });
