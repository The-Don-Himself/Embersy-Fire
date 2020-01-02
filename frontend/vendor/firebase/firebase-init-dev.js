var config = {
  apiKey: "AIzaSyDmglnkCWICyvOxX-eiwHYbntulxZBrFhI",
  authDomain: "embersy-fire-dev.firebaseapp.com",
  databaseURL: "https://embersy-fire-dev.firebaseio.com",
  projectId: "embersy-fire-dev",
  storageBucket: "embersy-fire-dev.appspot.com",
  messagingSenderId: "51901482223",
  appId: "1:51901482223:web:7ea3d2421e0a2712df071a",
  measurementId: "G-GWNJBB7LKD"
};
if( typeof firebase !== 'undefined'  && firebase) {
	firebase.initializeApp(config);
}