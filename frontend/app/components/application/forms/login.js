import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationFormsLoginComponent extends Component {

  @service systemMessages;
  @service modalDialog;
  @service firebaseAuth;

  @action
  setTextField(element) {
    let MDCTextField = mdc.textField.MDCTextField;

    let emailTextbox = element.querySelector(".email");
    new MDCTextField(emailTextbox);
  }

}
