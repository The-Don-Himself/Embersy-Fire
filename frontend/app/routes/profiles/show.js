import Route from '@ember/routing/route';
import { get, set } from '@ember/object';

export default class ProfilesShowRoute extends Route {

      model(params) {
        return this.store.findRecord('profile', params.profile_id);
      }

      titleToken(model) {
        return '@' + get(model, 'username');
      }

      afterModel(model) {
        let title = '@' + get(model, 'username') || "404 - Profile Not Found!";
        set(this, 'headData.title', title);
        set(this, 'headData.description', '@' + get(model, 'username') + '\'s Profile on EmberSy Fire');
        set(this, 'headData.keywords', '@' + get(model, 'username') + '\'s Profile on EmberSy Fire');
        if(get(model, 'avatarversion')){
          set(this, 'headData.image', 'users/' + get(model, 'id') + '/v' + get(model, 'avatarversion') + '/avatar.jpeg');
        } else {
          set(this, 'headData.image', 'default-avatar.jpeg');
        }
        set(this, 'headData.imageType', 'image/jpeg');
        set(this, 'headData.imageWidth', '200');
        set(this, 'headData.imageHeight', '200');
        set(this, 'headData.profile', model);
      }

}
