// Import Firebase scripts
importScripts(
  `https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js`
);

importScripts(
  `https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js`
);

const urlParams = new URLSearchParams(location.search);
const firebaseConfig = Object.fromEntries(urlParams);

firebase.initializeApp(firebaseConfig);

console.log("[firebase-messaging-sw.js] initializeApp ", firebaseConfig);

let messaging;

try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
  console.error("Failed to initialize Firebase Messaging", err);
}

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
