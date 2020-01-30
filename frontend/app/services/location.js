import Service, { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';

export default class LocationService extends Service {
  @service systemMessages;

  @tracked ip;
  @tracked countryIso2;
  @tracked coordinates;

  // HTML5 Geolocation API
  isGeolocationSupported(){
    if ('geolocation' in navigator) {
      /* geolocation is available */
      return true;
    } else {
      /* geolocation IS NOT available */
      return false;
    }
  }

  getGeoOptions(){
    let geo_options = {
      enableHighAccuracy : true,
      maximumAge         : 60000,
      timeout            : 60000
    };
    return geo_options;
  }

  getCurrentPosition() {
    let service = this;

    let systemMessages = service.systemMessages;
    let geo_options = service.getGeoOptions();

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(function(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        resolve([latitude, longitude]);
      }, function(error){
        switch(error.code) {
          case error.PERMISSION_DENIED:
            systemMessages.show('You denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            systemMessages.show('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            systemMessages.show('The request to get user location timed out.');
            break;
          case error.UNKNOWN_ERROR:
            systemMessages.show('An unknown error occurred.');
            break;
        }
        reject();
      }, geo_options);
    });
  }

  getIp() {
    return this.ip;
  }

  setIp(ip) {
    this.ip = ip;
  }

  getCountryIso2() {
    return this.countryIso2;
  }

  setCountryIso2(countryIso2) {
    this.countryIso2 = countryIso2;
  }

  getCoordinates() {
    return this.coordinates;
  }

  setCoordinates(latlon) {
    this.coordinates = latlon;
  }

  trace() {
    let service = this;
    let trace = [];

    fetch('/cdn-cgi/trace')
      .then((response) => {
        return response.status !== 200 ? Promise.resolve(null) : response.text();
      })
      .then((data) => {
        let lines = data.split('\n');
        let keyValue;

        lines.forEach(function(line){
          keyValue = line.split('=');
          trace[keyValue[0]] = decodeURIComponent(keyValue[1] || '');

          if(keyValue[0] === 'loc' && trace['loc'] !== 'XX'){
            service.setCountryIso2(trace['loc'].trim());
          }

          if(keyValue[0] === 'ip'){
            service.setIp(trace['ip'].trim());
          }

        });

      })
      .catch(() => {

      })
  }

}
