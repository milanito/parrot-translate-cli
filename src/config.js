export default {
  optionsFile: '.parrot',
  tokenPath: '/api/v1/auth/token',
  projectsPath: '/api/v1/projects',
  keyAddPath: '/api/v1/projects/{{project_id}}/keys',
  projectLocalesPath: '/api/v1/projects/{{project_id}}/locales',
  localeImportPath: '/api/v1/projects/{{project_id}}/locales/{{locale_id}}/pairs',
  chunkSize: 10,
  auth: {
    // eslint-disable-next-line
    grant_type: 'password',
  }
};
