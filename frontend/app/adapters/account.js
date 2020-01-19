import ApplicationAdapter from './application';
import ENV from 'embersy-fire/config/environment';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default class AccountAdapter extends ApplicationAdapter {
  @service session;

  get headers() {
    return {
      'Authorization': 'Bearer ' + get(this.session.token)
    };
  }

  queryRecord(store, type, query) {
    return fetch(ENV.apiUrl + '/api/accounts/me');
  }
}
