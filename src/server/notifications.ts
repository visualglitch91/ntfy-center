import { Router } from "express";
import admin from "firebase-admin";
import ShortUniqueId from "short-unique-id";
import { Notification } from "../common/types";
import { addKnownTopic, getTopicIcon } from "./topics.utils";
import { notificationsDB, capNotifications } from "./notifications.utils";
import { formatTopic } from "./utils";

const uid = new ShortUniqueId({ length: 10 });
const notificationsRouter = Router();

notificationsRouter.post("/", async (req, res) => {
  const id = uid.seq();
  const notification: Notification = { id, ...req.body };

  notification.icon = getTopicIcon(notification.topic);

  if (!notification.timestamp) {
    notification.timestamp = Date.now().toString();
  }

  capNotifications();

  notificationsDB.set(id, notification);

  await addKnownTopic(notification.topic);

  await admin.messaging().send({
    data: { raw: JSON.stringify(notification) },
    topic: formatTopic(notification.topic),
  });

  res.sendStatus(200);
});

notificationsRouter.get("/", (_, res) => {
  res.json(Object.values(notificationsDB.JSON()));
});

notificationsRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Notification ID is required" });
  }

  if (id === "all") {
    notificationsDB.deleteAll();
    return res.sendStatus(204);
  }

  if (!notificationsDB.has(id)) {
    return res.status(404).json({ error: "Notification not found" });
  }

  notificationsDB.delete(id);
  return res.sendStatus(204);
});

export default notificationsRouter;
