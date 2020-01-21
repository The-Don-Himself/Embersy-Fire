import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default class IndexRoute extends Route {

  @service session;
  @service fastboot;

  titleToken = function() {
    let isFastBoot = get(this, 'fastboot.isFastBoot');
    if (isFastBoot) {
      return "Welcome To EmberSy Fire";
    } else {
      return get(this, 'session.isAuthenticated') ? "EmberSy Fire" : "Welcome To EmberSy Fire";
    }
  }

  afterModel() {
    let title = get(this, 'session.isAuthenticated') ? "EmberSy Fire" : "Welcome To EmberSy Fire";
    set(this, 'headData.title', title);
    set(this, 'headData.home', true);
  }

}
