import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Cropper from 'cropperjs';
import ENV from 'embersy-fire/config/environment';
import fetch from 'fetch';

export default class ProfileEditShowComponent extends Component {

    @service session;

    @tracked selectedImage;
    @tracked processing;

    cropper;

    @action
    setMDCTextField(element) {
      let MDCTextField = mdc.textField.MDCTextField;

      setTimeout(function(){
        new MDCTextField(element);
      },750);
    }

    @action
    previewImage(evt /* DOM event */) {
      const { target } = evt;

      let component = this;

      let cropper = component.cropper;

      let file = target.files[0];

      if(file){
        component.selectedImage = true;

        let reader = new FileReader();
        reader.onload = function(){
          let imageElement = document.querySelector('.image-upload');
          imageElement.src = reader.result;

          if(cropper){
            cropper.destroy();
          }

          component.setCropperJS(imageElement);
        }
        reader.readAsDataURL(file);
      } else {
        if(cropper){
          cropper.destroy();
          component.cropper = undefined;
        }
        component.selectedImage = false;
      }

    }

    @action
    setCropperJS(element) {
      let component = this;

      let cropper = new Cropper(element, {
        aspectRatio: 1 / 1
      });

      component.cropper = cropper;
    }

    @action
    submitProfileEditForm(evt /* DOM event */) {
      let component = this;
      component.processing = true;

      evt.preventDefault();
      const { target } = evt;

      let formData = new FormData(target);

      let cropper = component.cropper;
      if(cropper){
        cropper.getCroppedCanvas({
          width: 400,
          height: 400,
          minWidth: 400,
          minHeight: 400,
          maxWidth: 400,
          maxHeight: 400,
          fillColor: '#fff',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        });

        let dataURL = cropper.getCroppedCanvas().toDataURL();
        formData.append('avatar', dataURL);
      }

      let session = component.session;

      session.getToken()
        .then((token) => {

          const headers = {};

          headers['X-AUTH-TOKEN'] = token;
          headers['Accept'] = 'application/json, text/javascript, */*';

          let fetchInit = {
            method: 'POST',
            headers: headers,
            body: formData
          };

          fetch(ENV.apiUrl + '/api/accounts/edit' , fetchInit)
          .then(function(){
            session.loadCurrentUser();
          })
          .catch(function(){

          })
          .then(function(){
            component.processing = false;
          });

        });

    }

}
