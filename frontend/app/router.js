import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default class Router extends EmberRouter {
  @service session;
  @service fastboot;
  @service headData;

  location = config.locationType;
  rootURL = config.rootURL;

  setTitle(title) {
    let router = this;

    let headData = get(router, 'headData');
    set(headData, 'title', title);
  }

  init() {
    super.init(...arguments);

    let router = this;

    let isFastBoot = get(router, 'fastboot.isFastBoot');

    this.on('routeWillChange', transition => {
      if (!isFastBoot) {
        if (!get(router, 'session.isAuthenticated')) {
          set(router, 'session.attemptedTransition', transition);
        }
      }
    });

    this.on('routeDidChange', transition => {
      if (isFastBoot) {
        let headers = this.get('fastboot.response.headers');
        headers.delete('Set-Cookie');
      } else {
        // $('html, body').animate({ scrollTop: 0 }, 500);
      }
    });
  }

}

Router.map(function() {
  this.route('sign-up');
  this.route('profile');
  this.route('login');
});
