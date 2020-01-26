import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ApplicationMdcTabLoginOrSignUpComponent extends Component {

  @tracked tabs = [
    {
      label: 'Login',
      icon: 'lock'
    },
    {
      label: 'Sign Up',
      icon: 'person_add'
    }
  ];

}
