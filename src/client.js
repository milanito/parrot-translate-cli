import ProgressBar from 'progress';
import Promise from 'bluebird';
import moment from 'moment';
import request from 'request-promise';
import {
  assign, first, get, isEmpty, join,
  map, merge, replace, size, tail
} from 'lodash';

import {
  keyAddPath, tokenPath, projectsPath, localeImportPath,
  projectLocalesPath, auth
} from './config';

/**
 * This function authenticate the user from the provided
 * credentials to the parrot backend
 * @param { String } host the host address
 * @param { String } username the user's email
 * @param { String } password the user's password
 * @return { Object } an object containing the token
 */
export const retrieveToken = ({ host, username, password }) =>
  new Promise((resolve, reject) =>
    request.post({
      uri: join([host, tokenPath], ''),
      rejectUnauthorized: false,
      form: merge(auth, { username, password }),
      json: true
    })
      .then((body) => {
        const token = get(body, 'payload.access_token', '');
        const exp = moment().add(get(body, 'payload.expires_in', 0), 'seconds').toDate();
        return resolve({ token, exp });
      })
      .catch(err => reject(err)));

/**
 * This function retrieves the user's projects
 * @param { String } host the host address
 * @param { String } token the user's token
 * @param { String } password the user's password
 * @return { Object } an object containing the host, the token
 * and the projects
 */
export const retrieveProjects = ({ host, token }) =>
  new Promise((resolve, reject) =>
    request.get({
      uri: join([host, projectsPath], ''),
      rejectUnauthorized: false,
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: true,
    })
      .then(body => resolve(merge({ host, token }, {
        projects: map(get(body, 'payload', []), ({ name, id }) => assign({
          name,
          value: id
        }))
      })))
      .catch(err => reject(err)));

/**
 * This function adds keys to a specific project
 * @param { String } host the host address
 * @param { String } token the user's token
 * @param { String } ks the keys
 * @param { String } projectId the project Id
 * @return { Boolean } true if every request was made
 */
export const addKeys = ({ host, token, ks, projectId }) =>
  new Promise((resolve) => {
    const bar = new ProgressBar('Adding Keys ## :bar | :percent - :elapsed s',
      { total: size(ks) });
    const loader = (arr) => {
      const finisher = () => setTimeout(() => {
        bar.tick();
        const rest = tail(arr);
        if (isEmpty(rest)) {
          return resolve(true);
        }
        return loader(rest);
      }, 1000);

      return Promise.all(map(first(arr), key =>
        request.post({
          uri: join(([host, replace(keyAddPath, '{{project_id}}', projectId)]), ''),
          rejectUnauthorized: false,
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: { key },
          json: true,
        })))
        .then(finisher)
        .catch(finisher);
    };

    return loader(ks);
  });

/**
 * This function retrieves the locales for a specific project
 * @param { String } host the host address
 * @param { String } token the user's token
 * @param { String } data some data
 * @param { String } projectId the project Id
 * @return { Boolean } true if every request was made
 */
export const retrieveProjectLocales = ({ host, token, data, projectId }) =>
  new Promise((resolve, reject) =>
    request.get({
      uri: join([host, replace(projectLocalesPath, '{{project_id}}', projectId)], ''),
      rejectUnauthorized: false,
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: true,
    })
      .then(body => resolve(merge({ host, token, data, projectId }, {
        locales: map(get(body, 'payload', []), ({ language, ident }) => assign({
          name: `${language} | ${ident}`,
          value: ident
        }))
      })))
      .catch(err => reject(err)));

/**
 * This function adds keys to a specific locale for a project
 * @param { String } host the host address
 * @param { String } token the user's token
 * @param { String } data the keys to update
 * @param { String } projectId the project Id
 * @param { String } localeId the locale ident
 * @return { Boolean } true if every request was made
 */
export const sendKeys = ({ host, token, data, projectId, localeId }) =>
  request.patch({
    uri: join(([
      host,
      replace(replace(localeImportPath, '{{project_id}}', projectId),
        '{{locale_id}}', localeId)
    ]), ''),
    rejectUnauthorized: false,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data,
    json: true,
  });
