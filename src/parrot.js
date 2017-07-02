#!/usr/bin/env node

import commander from 'commander';

commander
  .version('0.1.0')
  .description('This is the parrot CLI')
  .command('login', 'Login to the parrot backend')
  .alias('l')
  .command('logout', 'Logout of the parrot backend')
  .command('info', 'Info about the user')
  .alias('i')
  .command('import-keys', 'Import keys to project')
  .alias('ik')
  .command('import-locale-keys', 'Import keys to locale for a project')
  .alias('ilk')
  .parse(process.argv);
