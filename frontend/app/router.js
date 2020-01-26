import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';

export default class Router extends EmberRouter {
  @service session;
  @service fastboot;
  @service headData;

  location = config.locationType;
  rootURL = config.rootURL;

  setTitle(title) {
    let router = this;

    let headData = router.headData;
    headData.title = title;
  }

  init() {
    super.init(...arguments);

    let router = this;

    let isFastBoot = router.fastboot.isFastBoot;

    this.on('routeWillChange', transition => {
      if (!isFastBoot) {
        if (!router.session.isAuthenticated) {
          router.session.attemptedTransition = transition;
        }
      }
    });

    this.on('routeDidChange', (/* transition */) => {
      if (isFastBoot) {
        let headers = router.fastboot.response.headers;
        headers.delete('Set-Cookie');
      } else {
        // Do something like scroll back to the top on each page transition in the browser
        // Of course you'll need to install jQuery for below line to work 
        // $('html, body').animate({ scrollTop: 0 }, 500);
      }
    });
  }

}

Router.map(function() {
  this.route('sign-up');
  this.route('profile');
  this.route('login');
  this.route('profiles', function() {
    this.route('show', { path: '/:profile_id' });
  });
  this.route('server-error');
  this.route('page-not-found', { path: '/*wildcard' });
});
