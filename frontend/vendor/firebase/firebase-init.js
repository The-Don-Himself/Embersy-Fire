var config = {
  apiKey: "AIzaSyBWfVAMVxxFYrW_1tjEpRF5IOPOp1sioMo",
  authDomain: "embersy-fire.firebaseapp.com",
  databaseURL: "https://embersy-fire.firebaseio.com",
  projectId: "embersy-fire",
  storageBucket: "embersy-fire.appspot.com",
  messagingSenderId: "949509950969",
  appId: "1:949509950969:web:681e47b70e19dc21ba4128"
};
if( typeof firebase !== 'undefined'  && firebase) {
	firebase.initializeApp(config);
}