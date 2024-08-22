// Import Firebase scripts
importScripts(
  `https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js`
);

importScripts(
  `https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js`
);

const config = JSON.parse(
  atob(new URLSearchParams(location.search).get("config"))
);

const channel = new BroadcastChannel(config.broadcastChannelKey);

firebase.initializeApp(config.firebase);

let messaging;

try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
  console.error("Failed to initialize Firebase Messaging", err);
}

function notify(notification) {
  return self.registration.showNotification(
    [notification.topic, notification.title].filter(Boolean).join(": "),
    { body: notification.body, icon: notification.icon }
  );
}

channel.addEventListener("message", ({ data: payload }) => {
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
          (client) => client.url === config.baseURL
        );

        if (existingClient) {
          existingClient.focus();
        } else {
          clients.openWindow(config.baseURL);
        }
      })
  );
});

messaging.onBackgroundMessage((payload) => {
  channel.postMessage({ type: "BACKGROUND_MESSAGE" });
  return notify(JSON.parse(payload.data.raw));
});
