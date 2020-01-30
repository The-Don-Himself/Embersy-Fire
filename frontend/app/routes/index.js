import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {

  @service session;
  @service fastboot;
  @service headData;

  titleToken = function() {
    let isFastBoot = this.fastboot.isFastBoot;
    if (isFastBoot) {
      return "Welcome To EmberSy Fire";
    } else {
      return this.session.isAuthenticated ? "EmberSy Fire" : "Welcome To EmberSy Fire";
    }
  }

  afterModel() {
    let title = this.session.isAuthenticated ? "EmberSy Fire" : "Welcome To EmberSy Fire";
    this.headData.title = title;
    this.headData.home = true;
  }

}
