import { uniq, difference } from "lodash-es";
import admin from "firebase-admin";
import { Device } from "../common/types";
import { createJSONdb, formatTopic } from "./utils";

export const devicesDB = createJSONdb<Device>("devices");

export async function subscribe(token: string | string[], topics: string[]) {
  const tokens = new Array<string>().concat(token);

  await Promise.all(
    topics.map(async (topic) => {
      await admin.messaging().subscribeToTopic(tokens, formatTopic(topic));
    })
  );

  tokens.forEach((token) => {
    const device = devicesDB.get(token);

    if (device) {
      device.topics = uniq([...device.topics, ...topics]);
      devicesDB.set(device.token, device);
    }
  });
}

export async function unsubscribe(token: string | string[], topics: string[]) {
  const tokens = new Array<string>().concat(token);

  await Promise.all(
    topics.map((topic) =>
      admin.messaging().unsubscribeFromTopic(tokens, formatTopic(topic))
    )
  );

  tokens.forEach((token) => {
    const device = devicesDB.get(token);

    if (device) {
      device.topics = difference(device.topics, topics);
      devicesDB.set(device.token, device);
    }
  });
}

export function listAllDevices() {
  return Object.values(devicesDB.JSON());
}
