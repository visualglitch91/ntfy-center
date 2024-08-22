import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import config from "../../config.json";

let fcmPromise: Promise<any> | null = null;

export const BROADCAST_CHANNEL_KEY = "messaging-sw";

const channel = new BroadcastChannel(BROADCAST_CHANNEL_KEY);

export default async function initializeFCM() {
  if (fcmPromise === null) {
    fcmPromise = (async () => {
      const app = initializeApp(config.firebase);

      const url = `/messaging-sw.js?${new URLSearchParams({
        swVersion: "37",
        config: btoa(
          JSON.stringify({
            broadcastChannelKey: BROADCAST_CHANNEL_KEY,
            firebase: config.firebase,
            baseURL: config.baseURL,
          })
        ),
      }).toString()}`;

      const registration = await navigator.serviceWorker.register(url);

      await navigator.serviceWorker.ready;

      const messaging = getMessaging(app);

      onMessage(messaging, (payload: any) => {
        channel.postMessage({
          type: "FOREGROUND_MESSAGE",
          data: JSON.parse(payload.data.raw),
        });
      });

      const token = await getToken(messaging, {
        vapidKey: config.fcm.vapidKey,
        serviceWorkerRegistration: registration,
      });

      return token;
    })();
  }

  return fcmPromise;
}
