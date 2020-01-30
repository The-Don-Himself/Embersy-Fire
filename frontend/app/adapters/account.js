import ApplicationAdapter from './application';
import { inject as service } from '@ember/service';
import ENV from 'embersy-fire/config/environment';
import fetch from 'fetch';

export default class AccountAdapter extends ApplicationAdapter {

  @service session;

  queryRecord(/* store, type, query */) {
    let session = this.session;

    return session.getToken()
      .then((token) => {
        const headers = {};

        headers['X-AUTH-TOKEN'] = token;
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
