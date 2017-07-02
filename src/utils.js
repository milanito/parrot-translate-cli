import Promise from 'bluebird';
import moment from 'moment';
import winston from 'winston';
import { prompt } from 'inquirer';
import { homedir } from 'os';
import { red } from 'chalk';
import { readJSON, outputJSON } from 'fs-extra';
import {
  join, merge, isEmpty, isString,
  isObject, forEach
} from 'lodash';

import { optionsFile } from './config';
import { inputs, choices } from './questions';
import { retrieveProjects, retrieveToken } from './client';

/**
 * This function transforms a JSON from i18next format
 * to flat JSON
 * @param { String } host the host address
 * @param { String } token the user's token
 * @param { String } projectId the project Id
 * @param { Object } json the json to transform
 * @return { Object } a object containing all the data
 */
const _transformJson = ({ host, token, projectId, json }) =>
  new Promise((resolve) => {
    const data = {};
    const handleObject = (obj, prefix) => {
      forEach(obj, (value, key) => {
        const dataKey = !isEmpty(prefix) ? join([prefix, key], '.') : key;

        if (isString(value)) {
          data[dataKey] = value;
        } else if (isObject(value)) {
          handleObject(value, dataKey);
        }
      });
    };

    handleObject(json, '');

    return resolve({ host, token, projectId, data });
  });

/**
 * This function will :
 * - Fetch the user informations
 * - Retrieves the user's projects
 * - Prompt him for selection
 * - Extract the data from the JSON
 *  @param { String } file the file to use
 *  @return { Object } an object containing informations
 *  about the project
 */
export const startForProject = file =>
  readJSON(`${homedir()}/${optionsFile}`)
    .then(({ host, username, token, exp }) =>
      new Promise((resolve) => {
        if (moment().isAfter(moment(exp))) {
          return prompt([inputs.password])
            .then(({ password }) =>
              retrieveToken({ host, username, password })
                .then(result =>
                  outputJSON(`${homedir()}/${optionsFile}`,
                    merge({ host, username }, result))
                    .then(() => resolve({ host, token: result.token }))));
        }
        return resolve({ host, token });
      }))
    .then(retrieveProjects)
    .then(({ host, token, projects }) =>
      prompt([choices.projects(projects)])
        .then(({ projectId }) => merge({ host, token }, { projectId })))
    .then(data =>
      readJSON(file)
        .then(json => _transformJson(merge(data, { json }))));

/**
 * This function displays an error message and exits properly
 * @param { String } arg the missing argument name
 * @param { String } opt the opt to use
 * @return { Void }
 */
export const cleanExitOption = (arg, opt) => {
  winston.error(red(`No ${arg} provided. Use ${opt} option`));
  process.exit(1);
};
