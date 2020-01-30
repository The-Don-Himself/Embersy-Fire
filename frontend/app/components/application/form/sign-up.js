import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationFormSignUpComponent extends Component {

    @service firebaseAuth;
    @service modalDialog;

    @action
    startFirebaseAuth() {
      let component = this;

      let firebaseAuth = component.firebaseAuth;
      let modalDialog = component.modalDialog;

      // Show the Firebase Auth in a Modal Dialog
      modalDialog.firebaseAuthDialog();

      // Give a few milliseconds then start Firebase Auth
      setTimeout(function(){
        firebaseAuth.start();
      },750);

    }

}
