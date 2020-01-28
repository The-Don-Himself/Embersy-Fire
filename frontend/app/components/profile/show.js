import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ProfileShowComponent extends Component {

  @service session;

  @action
  setMDCTextField(element) {
    let MDCTextField = mdc.textField.MDCTextField;

    setTimeout(function(){
      new MDCTextField(element);
    },750);
  }

}
