import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ApplicationMdcTopAppBarHeaderComponent extends Component {

  @action
  setScrollTarget(element) {
    let topAppBar = new mdc.topAppBar.MDCTopAppBar(element);
    let mainEl = document.getElementById('app-main');
    topAppBar.setScrollTarget(mainEl);
  }

}
