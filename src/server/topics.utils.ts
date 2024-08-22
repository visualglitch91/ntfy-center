import { createJSONdb } from "./utils";
import { listAllDevices, subscribe } from "./devices.utils";

export const knownTopicsDB = createJSONdb<{ icon?: string }>("knownTopics");

export function listKnownTopics() {
  return Object.keys(knownTopicsDB.JSON());
}

export function getTopicIcon(topic: string) {
  return knownTopicsDB.get(topic)?.icon;
}

export async function addKnownTopic(topic: string) {
  const currentKnownTopics = listKnownTopics();

  if (!currentKnownTopics.includes(topic)) {
    await subscribe(
      listAllDevices().map((device) => device.token),
      [topic]
    );

    knownTopicsDB.set(topic, {});
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
