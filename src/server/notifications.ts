import { Router } from "express";
import admin from "firebase-admin";
import { Notification } from "../common/types";
import { addKnownTopic } from "./topics.utils";
import {
  notificationsDB,
  capNotifications,
  listAllNotifications,
} from "./notifications.utils";
import { formatTopic } from "./utils";

const notificationsRouter = Router();

notificationsRouter.post("/", async (req, res) => {
  const id = (listAllNotifications().length + 1).toString();
  const notification: Notification = { id, ...req.body };

  if (!notification.timestamp) {
    notification.timestamp = Date.now().toString();
  }

  capNotifications();

  notificationsDB.set(id, notification);

  await addKnownTopic(notification.topic);

  await admin.messaging().send({
    notification: {
      title: [notification.topic, notification.title]
        .filter(Boolean)
        .join(": "),
      body: notification.body,
    },
    data: { raw: JSON.stringify(notification) },
    topic: formatTopic(notification.topic),
  });

  res.sendStatus(200);
});

notificationsRouter.get("/", (req, res) => {
  const id = Number(req.query.since);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const allNotifications = Object.values(notificationsDB.JSON());

  const filteredNotifications = allNotifications.filter((notification) => {
    return Number(notification.id) > id;
  });

  res.json(filteredNotifications);
});

notificationsRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Notification ID is required" });
  }

  if (!notificationsDB.has(id)) {
    return res.status(404).json({ error: "Notification not found" });
  }

  notificationsDB.delete(id);

  res.sendStatus(204);
});

export default notificationsRouter;
