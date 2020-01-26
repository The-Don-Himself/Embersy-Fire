import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash, Promise } from 'rsvp';

export default class ApplicationRoute extends Route {

  @service store;
  @service location;
  @service firebaseAuth;
  @service session;
  @service fastboot;

  beforeModel() {
    let isFastBoot = this.fastboot.isFastBoot;
    if (!isFastBoot) {
      let route = this;

      return hash({
        currentUser: route._loadCurrentUser(),
        location: fetch('/cdn-cgi/trace')
          .then((response) => route._returnResponseText(response))
          .then((data) => route._setLocationData(data))
          .catch(() => route._setLocationData(null))
      });
    }
  }

  afterModel(/* resolvedModel , transition */) {
    let isFastBoot = this.fastboot.isFastBoot;

    if (isFastBoot) {
      return Promise.resolve();
    } else {
      let firebaseAuth = this.firebaseAuth;

      if( typeof firebase !== 'undefined' && firebase) {
        firebaseAuth.observeStateChanged();
        firebaseAuth.initialize();
        firebaseAuth.checkIsSignInWithEmailLink();
      }

      let splash = document.getElementById('splash-screen');
      if(splash){
        splash.remove();
      }

    }
  }

  _loadCurrentUser() {
    let session = this.session;
    return session.loadCurrentUser();
  }

  _returnResponseText(response) {
    return response.status !== 200 ? Promise.resolve(null) : response.text();
  }

  _setLocationData(data) {
    let locationService = this.location;

    if(data === null){
      locationService.setCountryIso2('KE');
      return;
    }

    let trace = [];
    let lines = data.split('\n');
    let keyValue;

    lines.forEach(function(line){
      keyValue = line.split('=');
      trace[keyValue[0]] = decodeURIComponent(keyValue[1] || '');
      if(keyValue[0] === 'loc'){
        if(trace['loc'] !== 'XX'){
          locationService.setCountryIso2(trace['loc'].trim());
        }
      }

      if(keyValue[0] === 'ip'){
        locationService.setIp(trace['ip'].trim());
      }
    });
  }

}
