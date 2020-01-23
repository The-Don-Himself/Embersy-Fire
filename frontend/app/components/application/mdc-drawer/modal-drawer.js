import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationMdcDrawerModalDrawerComponent extends Component {
  @service fastboot;
  @service session;

  @action
  setMDCDrawer(element) {
    let MDCDrawer = mdc.drawer.MDCDrawer;
    let drawer = new MDCDrawer(element);

    let header = document.querySelector("header");
    header.querySelectorAll(".drawer-menu").forEach(function(menu) {
      menu.addEventListener("click", () => {
        drawer.open = !drawer.open;
      });
    });

    document.querySelector("main").addEventListener("click", () => {
      drawer.open = false;
    });

    document.querySelector("aside").addEventListener("click", () => {
      drawer.open = false;
    });

  }

}
