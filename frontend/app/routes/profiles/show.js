import Route from '@ember/routing/route';

export default class ProfilesShowRoute extends Route {

      model(params) {
        return this.store.findRecord('profile', params.profile_id);
      }

      titleToken(model) {
        return '@' + model.username;
      }

      afterModel(model) {
        let title = ( '@' + model.username ) || "404 - Profile Not Found!";
        this.headData.title = title;
        this.headData.description = '@' + model.username + '\'s Profile on EmberSy Fire';
        this.headData.keywords = '@' + model.username + '\'s Profile on EmberSy Fire';
        if(model.avatarversion){
          this.headData.image = 'users/' + model.id + '/v' + model.avatarversion + '/avatar.jpeg';
        } else {
          this.headData.image = 'default-avatar.jpeg';
        }
        this.headData.imageType = 'image/jpeg';
        this.headData.imageWidth = '200';
        this.headData.imageHeight = '200';
        this.headData.profile = model;
      }

}
