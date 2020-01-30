import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ProfileIndexComponent extends Component {

    @service session;
    @service fastboot;

}
