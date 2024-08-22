import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import config from "../../config.json";

let fcmPromise: Promise<any> | null = null;

export async function requestToken() {
  if (fcmPromise === null) {
    fcmPromise = (async () => {
      try {
        console.log("Setting up FCM");
        const app = initializeApp(config.firebase);

        // Register the service worker
        const registration = await navigator.serviceWorker.register(
          `/messaging-sw.js?${new URLSearchParams({
            swVersion: "25",
            baseURL: config.baseURL,
            ...config.firebase,
          }).toString()}`
        );

        // Wait until the service worker is ready
        await navigator.serviceWorker.ready;
        const messaging = getMessaging(app);

        onMessage(messaging, (payload: any) => {
          registration.active?.postMessage({
            type: "FOREGROUND_MESSAGE",
            data: JSON.parse(payload.data.raw),
          });
        });

        const token = await getToken(messaging, {
          vapidKey: config.fcm.vapidKey,
          serviceWorkerRegistration: registration,
        });

        return token;
      } catch (err) {
        alert(err);
        setTimeout(() => {
          fcmPromise = null;
        }, 1);
        return false;
      }
    })();
  }

  return fcmPromise;
}
