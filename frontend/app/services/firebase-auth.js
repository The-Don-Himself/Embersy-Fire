import Service, { inject as service } from '@ember/service';
import { Promise } from 'rsvp';

export default class FirebaseAuthService extends Service {
  @service store;
  @service session;
  @service modalDialog;
  @service systemMessages;
  @service location;

  init() {
    super.init(...arguments);

    let service = this;

    //this variable represents the total number of chats can be displayed according to the viewport width
    service.ui = undefined;
    service.uiConfig = undefined;
  }

  initialize() {
    let service = this;

    let location = service.location;
    let systemMessages = service.systemMessages;
    let modalDialog = service.modalDialog;

    let country_iso2 = location.getCountryIso2();

    // FirebaseUI config.
    let uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(/* authResult, redirectUrl */) {

          // let user = authResult.user;
          // let credential = authResult.credential;
          // let isNewUser = authResult.additionalUserInfo.isNewUser;
          // let providerId = authResult.additionalUserInfo.providerId;
          // let operationType = authResult.operationType;


          // Do something with the returned AuthResult.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.

          systemMessages.show('Login Success!');
          modalDialog.closeDialog();
          return false;
        },
        signInFailure: function(error) {

          systemMessages.show('Login Failed!');
          return new Promise.reject(error);
        }
      },
      credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
      signInFlow: 'popup',
      signInSuccessUrl: window.location.href,
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,

          // Whether the display name should be displayed in the Sign Up page.
          // requireDisplayName: true

          // Allow the user the ability to complete sign-in cross device,
          // including the mobile apps specified in the ActionCodeSettings
          // object below.
          forceSameDevice: false
        },
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          // Invisible reCAPTCHA with image challenge and bottom left badge.
          recaptchaParameters: {
            type: 'image',
            size: 'invisible',
            badge: 'inline'
          },
          defaultCountry: country_iso2,
          defaultNationalNumber: '1234567890'
        }
      ],
      tosUrl: 'https://embersy-fire.appscale.cloud/terms',
      privacyPolicyUrl: 'https://embersy-fire.appscale.cloud/privacy'
    };

    service.uiConfig = uiConfig;

    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    service.ui = ui;
  }

  start() {
    let service = this;

    let ui = service.ui;
    let uiConfig = service.uiConfig;

    ui.start('#firebaseui-auth-container', uiConfig);
  }

  checkIsSignInWithEmailLink() {
    let service = this;

    let systemMessages = service.systemMessages;

    // Confirm the link is a sign-in with email link.

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {

      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        // email = window.prompt('Please provide your email for confirmation');

        email = window.prompt('Please provide your email for confirmation');
      }

      let input = document.createElement('input');

      input.type = 'email';
      input.required = true;
      input.value = email;

      if(false === input.checkValidity()){
        systemMessages.show("An Invalid Email Address Was Provided, Authentication Cancelled!");
      } else {
        service.signInWithEmailLink(email);
      }

    }

  }

  sendSignInLinkToEmail(email) {
    let service = this;

    let systemMessages = service.systemMessages;
    let modalDialog = service.modalDialog;

    let actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: window.location.href,
      // This must be true.
      handleCodeInApp: true
      // iOS: {
      //   bundleId: 'com.example.ios'
      // },
      // android: {
      //  packageName: 'com.example.app',
      //  installApp: true
      // }
    };

    return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(function() {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);

        modalDialog.closeDialog();
        systemMessages.show('We\'ve sent an email to you, please open it and click on the link to complete login');
      })
      .catch(function(error) {
        // Some error occurred, you can inspect the code: error.code
        systemMessages.show('An Error Occurred With Code : ' + error.code + ' . Please Try Again Later');
      });
  }

  signInWithEmailLink(email) {
    let service = this;

    let systemMessages = service.systemMessages;

    // The client SDK will parse the code from the link for you.
    firebase.auth().signInWithEmailLink(email, window.location.href)
      .then(function() {
        window.localStorage.removeItem('emailForSignIn');

        systemMessages.show("Login Successfully Completed!");
      })
      .catch(function(error) {
        systemMessages.show('An Authentication Error Occurred With Code : ' + error.code + ' . Please Try Login Again Later');
      });
  }

  observeStateChanged() {
    let service = this;

    let session = service.session;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.getIdTokenResult()
          .then((idTokenResult) => {
            session.setToken(idTokenResult.token);
            if (idTokenResult.claims.admin) {
              session.setIsAdmin(true);
            } else {
              session.setIsAdmin(false);
            }

            session.setUser(user);

            if (idTokenResult.claims.profile_id) {
              let user_id = idTokenResult.claims.profile_id;
              session.setUserId(user_id);
            }

            session.setIsAuthenticated(true);
            session.loadCurrentUser();
          })
          .catch(() => {

          });
      } else {
        // User is signed out.
        // ...
      }
    });
  }

  signInWithCustomToken(firebase_token) {
    let service = this;

    let systemMessages = service.systemMessages;

    return firebase.auth().signInWithCustomToken(firebase_token).catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      systemMessages.show('Firebase Authentication Error ' + errorCode + ' : ' + errorMessage);
    });
  }

}
