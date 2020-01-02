/* eslint-env es6 */
/* eslint no-unused-vars: 0 */
/* global importScripts */
importScripts('/firebase-app.js');
importScripts('/firebase-messaging.js');

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
    messagingSenderId: "51901482223"
};
firebase.initializeApp(config);

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a sevice worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here

    var messageObject = {
        push: true,
        payload: payload.data
    };

    // Retrieve a list of the clients of this service worker.
    self.clients.matchAll().then(function(clientList) {
        // Check if there's at least one focused client.
        var focused = clientList.some(function(client) {
            return client.focused;
        });

        if (focused) {
            // We are on one tab with site open
            focused.postMessage(messageObject);
        } else if (clientList.length > 0) {
            // We have at least one tab open although not focused
            clientList[0].postMessage(messageObject);
        } else {
            // No tab open show native no
            event.waitUntil(self.registration.showNotification(payload.title, {
                tag: payload.id,
                icon: payload.icon,
                body: payload.message.replace(/<(?:.|\n)*?>/gm, ''),
                click_action: payload.link
            }));
        }

    });

});
