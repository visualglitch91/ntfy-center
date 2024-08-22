// Import Firebase scripts
importScripts(
  `https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js`
);

importScripts(
  `https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js`
);

const urlParams = new URLSearchParams(location.search);
const { baseURL, ...firebaseConfig } = Object.fromEntries(urlParams);

firebase.initializeApp(firebaseConfig);

console.log("[firebase-messaging-sw.js] initializeApp ", firebaseConfig);

let messaging;

try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
  console.error("Failed to initialize Firebase Messaging", err);
}

function notify(notification) {
  self.registration.showNotification(
    [notification.topic, notification.title].filter(Boolean).join(": "),
    { body: notification.body }
  );
}

self.addEventListener("message", (event) => {
  const payload = event.data;

  if (payload.type === "FOREGROUND_MESSAGE") {
    notify(payload.data);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const existingClient = clientList.find(
          (client) => client.url === baseURL
        );

        if (existingClient) {
          existingClient.focus();
        } else {
          clients.openWindow(baseURL);
        }
      })
  );
});

messaging.onBackgroundMessage((payload) => {
  notify(JSON.parse(payload.data.raw));
});
