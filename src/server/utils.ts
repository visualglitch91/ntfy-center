import { dirname } from "path";
import { fileURLToPath } from "url";
import JSONdb from "simple-json-db";

//@ts-expect-error
export const serverDir: string = dirname(fileURLToPath(import.meta.url));

export function createJSONdb<T>(name: string) {
  return new JSONdb<T>(`${serverDir}/../../database/${name}.json`);
}

export function formatTopic(topic: string) {
  return topic.replace(/[^a-zA-Z0-9-_.~%]/g, "-");
}
