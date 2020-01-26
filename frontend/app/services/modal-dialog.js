import Service from '@ember/service';

export default class ModalDialogService extends Service {
  setDialog(dialog) {
    this.dialog = dialog;
  }

  loginDialog() {
    this.login = true;
    this.custom = false;
    this.search = false;
    this.firebaseAuth = false;

    let dialog = this.dialog;
    dialog.open();
  }

  customDialog(title, content) {
    this.login = false;
    this.custom = true;
    this.custom.title = title;
    this.custom.content = content;
    this.search = false;
    this.firebaseAuth = false;

    let dialog = this.dialog;
    dialog.open();
  }

  firebaseAuthDialog() {
    this.login = false;
    this.custom = false;
    this.search = false;
    this.firebaseAuth = true;

    let dialog = this.dialog;
    dialog.open();
  }

  closeDialog() {
    this.login = false;
    this.custom = false;
    this.search = false;
    this.firebaseAuth = false;

    let dialog = this.dialog;
    if (dialog.isOpen) {
      dialog.close();
    }
  }

}
