import { Notification } from "../common/types";
import { createJSONdb } from "./utils";

export const notificationsDB = createJSONdb<Notification>("notifications");

export function listAllNotifications() {
  return Object.values(notificationsDB.JSON());
}

export function capNotifications() {
  const allNotifications = listAllNotifications();

  if (allNotifications.length >= 90) {
    allNotifications.sort((a, b) => Number(a.id) - Number(b.id));
    notificationsDB.delete(allNotifications[0].id);
  }
}
