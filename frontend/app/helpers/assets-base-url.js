import { helper } from '@ember/component/helper';
import ENV from 'embersy-fire/config/environment';

export default helper(function assetsBaseUrl() {
  return ENV.assetsBaseUrl;
});
