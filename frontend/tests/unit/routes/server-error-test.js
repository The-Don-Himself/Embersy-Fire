import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | server-error', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:server-error');
    assert.ok(route);
  });
});
