import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action, get, getProperties, set } from '@ember/object';

export default class ApplicationFormsLoginComponent extends Component {

  @service firebaseAuth;

  @action
  setMDCTextField(element) {
    let MDCTextField = mdc.textField.MDCTextField;

    let emailTextbox = element.querySelector(".email");
    new MDCTextField(emailTextbox);
  }

  @action
  sendSignInLinkToEmail() {
    let component = this;

    let firebaseAuth = get(component, 'firebaseAuth');
    let { email } = getProperties(component, 'email');

    set(component, 'processing', true);
    firebaseAuth.sendSignInLinkToEmail(email)
      .then(function() {
        set(component, 'processing', false);
      });
  }

}
