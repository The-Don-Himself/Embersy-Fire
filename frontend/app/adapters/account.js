import ApplicationAdapter from './application';
import ENV from 'embersy-fire/config/environment';
import fetch from 'fetch';

export default class AccountAdapter extends ApplicationAdapter {

  queryRecord(/* store, type, query */) {
    return firebase.auth().currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        const headers = {};

        headers['X-AUTH-TOKEN'] = idTokenResult.token;
        headers['Accept'] = 'application/json, text/javascript, */*';

        let fetchInit = {
          method: 'GET',
          headers: headers
        };

        return fetch(ENV.apiUrl + '/api/accounts/me', fetchInit)
          .then((response) => response.json())
          .then((data) => {
            return data;
          })
          .catch(() => {
            // log error;
          });
    });
  }
}
