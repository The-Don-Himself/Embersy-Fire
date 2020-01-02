'use strict';

const { version } = require('./../package.json');

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'embersy-fire',
    environment,
    rootURL: '/',
    locationType: 'auto',
    apiNamespace: 'api',
    apiUrl: 'http://api.embersy-fire.localhost',
    assetsBaseUrl: 'http://static.embersy-fire.localhost',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      version: version
    },

    fastboot: {
      fastbootHeaders: true,
      hostWhitelist: ['embersy-fire.localhost', 'embersy-fire.appscale.cloud', 'dev-embersy-fire.appscale.cloud', 'localhost', '127.0.0.1', /.*?/]
    }

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.apiUrl = 'http://api.embersy-fire.localhost';
    ENV.assetsBaseUrl = 'http://static.embersy-fire.localhost';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV.apiUrl = 'http://api.embersy-fire.localhost';
    ENV.assetsBaseUrl = 'http://static.embersy-fire.localhost';
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.apiUrl = 'http://embersy-fire.appscale.cloud';
    ENV.assetsBaseUrl = 'http://static.appscale.cloud/embersy-fire/';
  }

  return ENV;
};
