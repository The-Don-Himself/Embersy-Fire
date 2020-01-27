import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action, getProperties } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Cropper from 'cropperjs';

export default class ProfileEditShowComponent extends Component {

    @service session;

    @tracked selectedImage;
    @tracked processing;

    @action
    setMDCTextField(element) {
      let MDCTextField = mdc.textField.MDCTextField;

      setTimeout(function(){
        new MDCTextField(element);
      },750);
    }

    @action
    previewImage() {
      let component = this;
      component.selectedImage = true;
    }

    @action
    setCropperJS(element) {
      let cropper = new Cropper(element, {
        aspectRatio: 1 / 1,
        crop(event) {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
        },
      });
    }

    @action
    updateProfile(evt /* DOM event */) {
      let component = this;

      evt.preventDefault();
      const { target } = evt;

      let formData = new FormData(target);

      let profile = JSON.stringify(Object.fromEntries(formData));
      console.log(profile);

      component.processing = true;
    }

}
