import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationMdcDialogSimpleDialogComponent extends Component {
  @service modalDialog;
  @service firebaseAuth;

  @action
  setMDCDialog(element) {
    let component = this;

    let MDCDialog = mdc.dialog.MDCDialog;
    let dialog = new MDCDialog(element);

    let modalDialog = get(component, 'modalDialog');
    modalDialog.setDialog(dialog);

    let firebaseAuth = get(component, 'firebaseAuth');
    let ui = get(firebaseAuth, 'ui');
    if (ui.isPendingRedirect()) {
      modalDialog.firebaseAuthDialog();
      setTimeout(function(){
        firebaseAuth.start();
      },750);
    }

  }

}
