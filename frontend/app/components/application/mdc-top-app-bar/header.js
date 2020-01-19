import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationMdcTopAppBarHeaderComponent extends Component {
  @service fastboot;
  @service session;

  @action
  setScrollTarget(element) {
    let topAppBar = new mdc.topAppBar.MDCTopAppBar(element);
    let mainEl = document.getElementById('app-main');
    topAppBar.setScrollTarget(mainEl);
  }

}
