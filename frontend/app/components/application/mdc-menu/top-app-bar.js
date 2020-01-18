import Component from '@glimmer/component';
import { action, get } from '@ember/object';

export default class ApplicationMdcMenuTopAppBarComponent extends Component {

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
      let session = get(component, 'session');
      session.invalidate();
    }

}
