/*jshint esversion: 6 */
/*globals require, process */
const FastBootAppServer = require('fastboot-app-server');
const BitbucketDownloader = require('fastboot-bitbucket-downloader');
const BitbucketNotifier = require('fastboot-bitbucket-notifier');
const fs = require('fs');

// Custom Middlewares
function modifyResponse(req, res, next) {
  if (!req.url.includes('.')) {
    let assetMap = JSON.parse(fs.readFileSync('dist/assets/assetMap.json', 'utf-8'));
    let pushedAssets = [];

    pushedAssets.push('</' + assetMap.assets["favicon-16x16.png"] + '>; rel=preload; as=image');
    pushedAssets.push('</' + assetMap.assets["favicon-32x32.png"] + '>; rel=preload; as=image');
    pushedAssets.push('</' + assetMap.assets["favicon-192x192.png"] + '>; rel=preload; as=image');

    pushedAssets.push('</' + assetMap.assets["assets/app.css"] + '>; rel=preload; as=style');
    pushedAssets.push('</iconfont/MaterialIcons-Regular.woff2>; rel=preload; as=font');
    pushedAssets.push('</' + assetMap.assets["assets/app.js"] + '>; rel=preload; as=script');

    pushedAssets.push('</firebase-app.js>; rel=preload; as=script');
    pushedAssets.push('</firebase-auth.js>; rel=preload; as=script');
    pushedAssets.push('</firebase-messaging.js>; rel=preload; as=script');
    pushedAssets.push('</firebase-messaging-sw.js>; rel=preload; as=script');
    pushedAssets.push('</firebase-init.js>; rel=preload; as=script');

    pushedAssets.push('</api/countries>; rel=preload; as=fetch');
    pushedAssets.push('</api/categories>; rel=preload; as=fetch');
    pushedAssets.push('</api/app-categories>; rel=preload; as=fetch');

    pushedAssets.push('</app-shell.html>; rel=preload; as=fetch');

    res.header('Link', pushedAssets.join(','));
  }

  //  no-transform : https://support.google.com/webmasters/answer/6211428?hl=en
  res.header('Cache-Control', 'public, s-maxage=86400, max-age=86400, immutable, stale-if-error=31536000, stale-while-revalidate=31536000');

  if (req.url.includes('.js')) {
    if (req.url == '/sw.js' ||
      req.url == '/firebase-app.js' ||
      req.url == '/firebase-auth.js' ||
      req.url == '/firebase-messaging.js' ||
      req.url == '/firebase-messaging-sw.js' ||
      req.url == '/firebase-init.js'
    ) {
      res.header('Cache-Control', 'public, s-maxage=86400, max-age=86400, immutable, stale-if-error=31536000, stale-while-revalidate=31536000');
    } else {
      res.header('Cache-Control', 'public, s-maxage=2592000, max-age=2592000, immutable, stale-if-error=31536000, stale-while-revalidate=31536000');
    }
  }

  if (req.url.includes('.css')) {
    res.header('Cache-Control', 'public, s-maxage=2592000, max-age=2592000, immutable, stale-if-error=31536000, stale-while-revalidate=31536000');
  }

  if (req.url.includes('.png') ||
    req.url.includes('.jpg') ||
    req.url.includes('.jpeg') ||
    req.url.includes('.svg') ||
    req.url.includes('.ico')
  ) {
    res.header('Cache-Control', 'public, s-maxage=2592000, max-age=2592000, immutable, stale-if-error=31536000, stale-while-revalidate=31536000');
  }

  if (req.url == '/page-not-found') {
    res.status(404);
  }

  if (req.url == '/server-error') {
    res.status(503);
  }

  return next();
}

let downloader = new BitbucketDownloader({
  url: 'https://api.bitbucket.org',     // Bitbucket API host
  username: 'my_bitbucket_username',    // your Bitbucket username
  password: 'my_bitbucket_app_password',// your Bitbucket app password
  repo: 'my-org/ember.js',              // name of your repo
  filename: 'dist.zip',                 // The download filename in your repo's downloads section
  path: 'dist'                          // optional path of the `dist` directory, defaults to 'dist'
});

let notifier = new BitbucketNotifier({
  url: 'https://api.bitbucket.org',     // Bitbucket API host
  username: 'my_bitbucket_username',    // your Bitbucket username
  password: 'my_bitbucket_app_password',// your Bitbucket app password
  repo: 'my-org/ember.js',              // name of your repo
  filename: 'dist.zip',                 // The download filename in your repo's downloads section
  poll: 300 * 1000                      // optional polling interval, defaults to 300 * 1000
});

let server = new FastBootAppServer({
  downloader: downloader,
  notifier: notifier,
  gzip: true,
  port: 3000,
  beforeMiddleware: function (app) {
    app.use(modifyResponse);
  },
  chunkedResponse: true
});

server.start();
