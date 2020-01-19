import Service, { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import ENV from 'embersy-fire/config/environment';

export default class SessionService extends Service {

  @service('store') store;
  @service firebaseAuth;
  @service systemMessages;

  init() {
    super.init(...arguments);

    let service = this;

    //this variable represents the total number of chats can be displayed according to the viewport width
    set(service, 'isAuthenticated', undefined);
    set(service, 'isAdmin', undefined);
    set(service, 'user_id', 0);
    set(service, 'user', {});
    set(service, 'token', undefined);
  }

  setToken(token) {
    let service = this;

    set(service, 'token', token);
  }

  setUser(user) {
    let service = this;

    set(service, 'user', user);
  }

  setUserId(user_id) {
    let service = this;

    set(service, 'user_id', user_id);
  }

  setIsAuthenticated(bool) {
    let service = this;

    set(service, 'isAuthenticated', bool);
  }

  setIsAdmin(bool) {
    let service = this;

    set(service, 'isAdmin', bool);
  }

  authorize(authorizerFactory, block) {
    let service = this;

    if (get(service, 'isAuthenticated')) {
      const token = get(service, 'token');
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
    }).catch(function(error) {
      // An error happened.
    });
  }

  signInWithCustomToken(firebase_token) {
    let service = this;

    let firebaseAuth = get(service, 'firebaseAuth');

    return firebaseAuth.signInWithCustomToken(firebase_token);
  }

  loadCurrentUser() {
    let service = this;

    let session = service;
    let store = get(service, 'store');

    let user = firebase.auth().currentUser;
    if(!user){
      return new Promise((resolve, reject) => {
        resolve();
      });
    }

    return store.queryRecord('account', {})
    .then(function(account) {
      set(service, 'profile' , account);

      let firebase_token = get(account, 'token');
      if(firebase_token){
        console.log('signInWithCustomToken');
        return session.signInWithCustomToken(firebase_token).then(function() {
    			return store.queryRecord('account', {})
    			.then(function(account) {
    				set(service, 'profile' , account);
    				let userId = get(account, 'id');
    				session.setUserId(userId);
    			})
    			.catch(function() {
    			  console.error('querying accounts record failed, invalidating session');
    			  session.invalidate();
    			});
    		})
    		.catch(function() {
    		  console.error('querying accounts record failed, invalidating session');
    		  session.invalidate();
    		});
      } else {
	      let userId = get(account, 'id');
      }

    })
    .catch(function() {
      console.error('querying accounts record failed, invalidating session');
      session.invalidate();
    });

  }

  logoutUser() {
    let service = this;

    let session = service;
    let userId = get(service, 'profile.id');

    if (get(session, 'isAuthenticated')) {
      const headers = {};
      session.authorize('authorizer:oauth2', (headerName, headerValue) => {
        headers[headerName] = headerValue;
      });

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

};
