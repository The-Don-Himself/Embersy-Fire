import Service, { inject as service } from '@ember/service';
import ENV from 'embersy-fire/config/environment';
import { Promise } from 'rsvp';
import { tracked } from '@glimmer/tracking';

export default class SessionService extends Service {

  @service store;
  @service firebaseAuth;
  @service systemMessages;

  @tracked isAuthenticated;
  @tracked isAdmin;
  @tracked user_id;
  @tracked user;
  @tracked token;
  @tracked profile;

  setToken(token) {
    let service = this;

    service.token = token;
  }

  setUser(user) {
    let service = this;

    service.user = user;
  }

  setUserId(user_id) {
    let service = this;

    service.user_id = user_id;
  }

  setIsAuthenticated(bool) {
    let service = this;

    service.isAuthenticated = bool;
  }

  setIsAdmin(bool) {
    let service = this;

    service.isAdmin = bool;
  }

  authorize(authorizerFactory, block) {
    let service = this;

    if (service.isAuthenticated) {
      const token = service.token;
      if (token) {
        block('Authorization', `Bearer ${token}`);
      }
    }
  }

  invalidate() {
    let service = this;

    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      service.setIsAuthenticated(false);
      service.setIsAdmin(false);
      service.setUserId(0);
      service.setToken(undefined);
    }).catch(function() {
      // error;
    });
  }

  signInWithCustomToken(firebase_token) {
    let service = this;

    let firebaseAuth = service.firebaseAuth;

    return firebaseAuth.signInWithCustomToken(firebase_token);
  }

  loadCurrentUser() {
    let service = this;

    let session = service;
    let store = service.store;

    let user = firebase.auth().currentUser;
    if(!user){
      return Promise.resolve();
    }

    return store.queryRecord('account', {})
    .then(function(account) {
      service.profile = account;

      let firebase_token = account.token;
      if(firebase_token){
        // signInWithCustomToken
        return session.signInWithCustomToken(firebase_token).then(function() {
          return store.queryRecord('account', {})
          .then(function(account) {
            service.profile = account;
            let userId = account.id;
            session.setUserId(userId);
          })
          .catch(function() {
            // signInWithCustomToken failed, invalidating session
            session.invalidate();
          });
        })
        .catch(function() {
          // querying accounts record failed, invalidating session
          session.invalidate();
        });
      }

    })
    .catch(function() {
      // querying accounts record failed, invalidating session
      session.invalidate();
    });

  }

  logoutUser() {
    let service = this;

    let session = service;

    if (session.isAuthenticated) {
      const headers = {};

      headers['X-AUTH-TOKEN'] = session.token;
      headers['Accept'] = 'application/json, text/javascript, */*';

      let fetchInit = {
        method: 'POST',
        headers: headers,
        cache: 'default'
      };

      fetch(ENV.apiUrl + '/api/accounts/logout' , fetchInit)
      .then(function(){

      });
    }
  }

}
