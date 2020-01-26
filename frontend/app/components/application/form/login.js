import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action, getProperties } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationFormsLoginComponent extends Component {

  @service firebaseAuth;

  @tracked processing;

  @action
  setMDCTextField(element) {
    let MDCTextField = mdc.textField.MDCTextField;

    let emailTextbox = element.querySelector(".email");
    new MDCTextField(emailTextbox);
  }

  @action
  sendSignInLinkToEmail() {
    let component = this;

    let firebaseAuth = component.firebaseAuth;
    let { email } = getProperties(component, 'email');

    component.processing = true;
    firebaseAuth.sendSignInLinkToEmail(email)
      .then(function() {
        component.processing = false;
      });
  }

}
