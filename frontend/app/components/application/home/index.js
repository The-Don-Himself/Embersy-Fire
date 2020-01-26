import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ApplicationHomeIndexComponent extends Component {

  @service session;
  @service fastboot;

}
