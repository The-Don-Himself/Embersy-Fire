export function initialize(application) {
  application.inject('component', 'router', 'service:router');
}

export default {
  name: 'router',
  initialize
};
