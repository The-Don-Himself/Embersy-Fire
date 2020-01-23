import Service, { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default class SystemMessagesService extends Service {
  @service fastboot;

  init() {
    super.init(...arguments);
    let service = this;

    let isFastBoot = get(service, 'fastboot.isFastBoot');
    if (!isFastBoot) {
      let MDCSnackbar = mdc.snackbar.MDCSnackbar;
      let snackbarElement = document.getElementById('snackbar');
      let snackbar = new MDCSnackbar(snackbarElement);

      set(service, 'snackbar', snackbar);
    }
  }

  show(message) {
    let snackbarElement = document.getElementById('snackbar');

    if(snackbarElement){
      snackbarElement.getElementsByClassName('mdc-snackbar__label').item(0).innerHTML = message;
      snackbarElement.getElementsByClassName('mdc-snackbar__action').item(0).innerHTML = 'OK';

      let snackbar = get(this, 'snackbar');
      snackbar.open();
    }

  }
}
