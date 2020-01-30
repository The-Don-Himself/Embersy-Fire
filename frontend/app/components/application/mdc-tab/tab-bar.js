import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ApplicationMdcTabTabBarComponent extends Component {

  @action
  setMDCTabBar(element) {
    let MDCTabBar = mdc.tabBar.MDCTabBar;
    let tabBar = new MDCTabBar(element);

    let tabPanels = element.parentElement.querySelector('.tabs');

    function updateTab(index) {
      tabPanels.querySelectorAll(".tab.active").forEach(function(tab) {
        tab.classList.remove('active');
      });

      if(index !== null) {
        tabPanels.querySelectorAll(".tab").item(index).classList.add('active');

        let indicator = element.querySelector('.mdc-tab-indicator');
        if (indicator && indicator.classList.contains('hidden')) {
          indicator.classList.remove('hidden');
        }
      }
    }

    tabBar.listen('MDCTabBar:activated', function ({detail: {index: number}}) {
      updateTab(number);
    });

  }

}
