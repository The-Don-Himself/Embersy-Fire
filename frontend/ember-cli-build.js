/* eslint-env node */
'use strict';

const { version } = require('./package.json');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    storeConfigInMeta: false,
    'ember-service-worker': {
      versionStrategy: 'project-version',
      registrationStrategy: 'inline',
      enabled: false
    },
    'esw-index': {
      // Where the location of your index file is at, defaults to `index.html`
      location: 'app-shell.html',

      // Bypass esw-index and don't serve cached index file for matching URLs
      excludeScope: [
        /\/api\/(.+)/i
      ],

      // changing this version number will bust the cache
      version: version
    },
    'asset-cache': {
      // which asset files to include, glob paths are allowed!
      // defaults to `['assets/**/*']`
      include: [
        'assets/app-*.css',
        'assets/app-*.js',
        'assets/images/*',
        'iconfont/MaterialIcons-Regular.woff2',
        'firebase-init.js',
        'firebase-app.js',
        'firebase-auth.js',
        'firebase-messaging.js',
        'firebase-messaging-sw.js',
        'firebaseui.css',
        'firebaseui.js'
      ],

      // changing this version number will bust the cache
      version: version
    },
    'esw-cache-first': {
      // RegExp patterns specifying which URLs to cache.
      patterns: [
        'assets/app-*.css',
        'assets/app-*.js',
        'assets/images/*',
        'https://static.appscale.cloud/(.+)',
        '/iconfont/(.+)',
        'https://www.gstatic.com/firebasejs/(.+)',
        'https://www.google-analytics.com/(.+)',
        'firebase-init.js',
        'firebase-app.js',
        'firebase-auth.js',
        'firebase-messaging.js',
        'firebase-messaging-sw.js',
        'firebaseui.css',
        'firebaseui.js'
      ],

      // changing this version number will bust the cache
      version: version
    },
    'esw-cache-fallback': {
      patterns: [
        '*.js',
        '*.css',
        '/api/(.+)',
        'https://static.appscale.cloud/(.+)',
        '/iconfont/(.+)',
        'https://www.gstatic.com/firebasejs/(.+)',
        'https://www.google-analytics.com/(.+)',
        'firebase-init.js',
        'firebase-app.js',
        'firebase-auth.js',
        'firebaseui.css',
        'firebaseui.js'
      ],

      // changing this version number will bust the cache
      version: version
    },
    emberCliConcat: {
      js: {
        concat: true
      },
      css: {
        concat: true,
        preserveOriginal: false
      }
    },
    fingerprint: {
      enabled: true,
      generateAssetMap: true,
      exclude: [
        'firebase-init',
        'firebase-app',
        'firebase-auth',
        'firebase-messaging',
        'firebase-messaging-sw',
        'firebaseui',
        '.well-known/assetlinks.json'
      ]
    },
    sassOptions: {
      implementation: require("sass"),
      // See https://github.com/webpack-contrib/sass-loader/issues/804
      webpackImporter: false,
      includePaths: [
        'node_modules'
      ]
    }
  });

  app.import('node_modules/normalize.css/normalize.css');
  app.import('vendor/material/material_fonts.css');

  app.import('node_modules/material-components-web/dist/material-components-web.js', {
    using: [{
      transformation: 'fastbootShim'
    }]
  });

  app.import('vendor/css/custom_app.css');
  app.import('vendor/css/colors.css');
  app.import('vendor/css/mdl-footer.css');

  app.import({
      development: 'vendor/firebase/firebase-init-dev.js',
      production:  'vendor/firebase/firebase-init.js'
    } , {
      outputFile: 'firebase-init.js'
  });

  app.import('node_modules/firebase/firebase-app.js', { outputFile: 'firebase-app.js'});
  app.import('node_modules/firebase/firebase-auth.js', { outputFile: 'firebase-auth.js'});
  app.import('node_modules/firebase/firebase-messaging.js', { outputFile: 'firebase-messaging.js'});
  app.import({
      development: 'vendor/firebase/firebase-messaging-sw-dev.js',
      production:  'vendor/firebase/firebase-messaging-sw.js'
    } , {
      outputFile: 'firebase-messaging-sw.js'
  });

  app.import('node_modules/firebaseui/dist/firebaseui.css');
  app.import('node_modules/firebaseui/dist/firebaseui.js', {
    using: [{
      transformation: 'fastbootShim'
    }]
  });

  app.import('node_modules/cropperjs/dist/cropper.css');
  app.import('node_modules/cropperjs/dist/cropper.js', {
    using: [{
      transformation: 'fastbootShim'
    }]
  });

  return app.toTree();
};
