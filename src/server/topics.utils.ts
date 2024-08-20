import { createJSONdb } from "./utils";
import { listAllDevices, subscribe } from "./devices.utils";

export const knownTopicsDB = createJSONdb<true>("knownTopics");

export function listKnownTopics() {
  return Object.keys(knownTopicsDB.JSON());
}

export async function addKnownTopic(topic: string) {
  const currentKnownTopics = listKnownTopics();

  if (!currentKnownTopics.includes(topic)) {
    await subscribe(
      listAllDevices().map((device) => device.token),
      [topic]
    );

    knownTopicsDB.set(topic, true);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
