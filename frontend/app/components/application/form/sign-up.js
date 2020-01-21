import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action, get } from '@ember/object';

export default class ApplicationFormSignUpComponent extends Component {

    @service firebaseAuth;
    @service modalDialog;

    @action
    startFirebaseAuth() {
      let component = this;

      let firebaseAuth = get(component, 'firebaseAuth');
      let modalDialog = get(component, 'modalDialog');

      modalDialog.firebaseAuthDialog();
      setTimeout(function(){
        firebaseAuth.start();
      },750);

    }

}
