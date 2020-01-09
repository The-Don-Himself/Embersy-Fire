import Service from '@ember/service';
import { get, set } from '@ember/object';

export default class ModalDialogService extends Service {
  setDialog(dialog) {
    set(this, 'dialog', dialog);
  }

  loginDialog() {
    set(this, 'login' , true);
    set(this, 'custom' , false);
    set(this, 'search' , false);
    set(this, 'firebaseAuth' , false);

    let dialog = get(this, 'dialog');
    dialog.open();
  }

  customDialog(title, content) {
    set(this, 'login' , false);
    set(this, 'custom' , true);
    set(this, 'custom.title' , title);
    set(this, 'custom.content' , content);
    set(this, 'search' , false);
    set(this, 'firebaseAuth' , false);

    let dialog = get(this, 'dialog');
    dialog.open();
  }

  firebaseAuthDialog() {
    set(this, 'login' , false);
    set(this, 'custom' , false);
    set(this, 'search' , false);
    set(this, 'firebaseAuth' , true);

    let dialog = get(this, 'dialog');
    dialog.open();
  }

  closeDialog() {
    set(this, 'login' , false);
    set(this, 'custom' , false);
    set(this, 'search' , false);
    set(this, 'firebaseAuth' , false);

    let dialog = get(this, 'dialog');
    if (dialog.isOpen) {
      dialog.close();
    }
  }

};
