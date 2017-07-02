import { assign } from 'lodash';

/**
 * This function creates a choice question for
 * the `prompt` module
 * @param { String } name the question name
 * @param { String } message the question message
 * @param { Array } choices the choices array
 */
const _defineChoicesQuestion = (name, message, choices) =>
  assign({ type: 'list', name, message, choices });

/**
 * This function creates a input question for
 * the `prompt` module
 * @param { String } name the question name
 * @param { String } message the question message
 * @param { String } type the question type, default to `input`
 */
const _defineInputQuestion = (name, message, type = 'input') =>
  assign({ type, name, message });

export default {
  inputs: {
    host: _defineInputQuestion('host', 'What is the parrot backend address ?'),
    username: _defineInputQuestion('username', 'What is your email ?'),
    password: _defineInputQuestion('password', 'What is your password ?', 'password')
  },
  choices: {
    projects: choices => _defineChoicesQuestion('projectId', 'Select a project', choices),
    locales: choices => _defineChoicesQuestion('localeId', 'Select a locale', choices)
  }
};
