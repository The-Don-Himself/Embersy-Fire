import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | application/mdc-linear-progress/indeterminate', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Application::MdcLinearProgress::Indeterminate />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <Application::MdcLinearProgress::Indeterminate>
        template block text
      </Application::MdcLinearProgress::Indeterminate>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
