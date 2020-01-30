import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationMdcMenuTopAppBarComponent extends Component {
    @service session;

    @action
    setMDCMenu(element) {
      let MDCMenu = mdc.menu.MDCMenu;

      let menuEl = element.querySelector(".mdc-menu");
      let menu = new MDCMenu(menuEl);

      element.querySelector(".toggle").addEventListener("click", () => {
        menu.open = !menu.open;
      });
    }

    @action
    invalidateSession() {
      let component = this;
      let session = component.session;
      session.invalidate();
    }

}
