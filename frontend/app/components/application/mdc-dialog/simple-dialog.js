import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationMdcDialogSimpleDialogComponent extends Component {
  @service modalDialog;

  @action
  setMDCDialog(element) {
    let component = this;

    let MDCDialog = mdc.dialog.MDCDialog;
    let dialog = new MDCDialog(element);

    let modalDialog = component.modalDialog;
    modalDialog.setDialog(dialog);
  }

}
