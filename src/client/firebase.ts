import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import config from "../../config.json";
import type { Notification } from "../common/types";

let promise: Promise<any> | null = null;

export async function initializeFCM({
  onNotification,
}: {
  onNotification: (notification: Notification) => void;
}) {
  if (promise === null) {
    promise = (async () => {
      const app = initializeApp(config.firebase);

      // Register the service worker
      const registration = await navigator.serviceWorker.register(
        `/messaging-sw.js?${new URLSearchParams({
          swVersion: "6",
          ...config.firebase,
        }).toString()}`
      );

      console.log("Service Worker registered with scope:", registration.scope);

      // Wait until the service worker is ready
      await navigator.serviceWorker.ready;

      const messaging = getMessaging(app);

      const token = await getToken(messaging, {
        vapidKey: config.fcm.vapidKey,
        serviceWorkerRegistration: registration,
      });

      onMessage(messaging, (payload) => {
        //@ts-expect-error
        onNotification(JSON.parse(payload.data.raw));
      });

      return token;
    })();
  }

  return promise;
}
