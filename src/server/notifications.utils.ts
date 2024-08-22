import { Notification } from "../common/types";
import { createJSONdb } from "./utils";

export const notificationsDB = createJSONdb<Notification>("notifications");

export function listAllNotifications() {
  return Object.values(notificationsDB.JSON());
}

export function capNotifications() {
  const allNotifications = listAllNotifications();

  if (allNotifications.length >= 90) {
    const oldestNotification = allNotifications.shift();

    if (oldestNotification) {
      notificationsDB.delete(oldestNotification.id);
    }
  }
}
