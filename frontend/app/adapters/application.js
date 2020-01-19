import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'embersy-fire/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = ENV.apiUrl;
  namespace = 'api';
}
