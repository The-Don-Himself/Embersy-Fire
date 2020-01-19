import ApplicationAdapter from './application';
import ENV from 'embersy-fire/config/environment';
import fetch from 'fetch';
import { inject as service } from '@ember/service';

export default class AccountAdapter extends ApplicationAdapter {

  @service session;
  get headers() {
    return {
      'X-AUTH-TOKEN': this.session.token
    };
  }

  queryRecord(store, type, query) {
    return firebase.auth().currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        const headers = {};

        headers['X-AUTH-TOKEN'] = idTokenResult.token;
        headers['Accept'] = 'application/json, text/javascript, */*';

        let fetchInit = {
          method: 'GET',
          headers: headers,
          cache: 'default'
        };

        return fetch(ENV.apiUrl + '/api/accounts/me', fetchInit);
    });
  }
}
