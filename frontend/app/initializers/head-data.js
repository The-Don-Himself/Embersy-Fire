export function initialize(application) {
  application.inject('route', 'headData', 'service:headData');
}

export default {
  name: 'head-data',
  initialize
};
