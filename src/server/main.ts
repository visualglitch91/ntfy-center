import express from "express";
import ViteExpress from "vite-express";
import admin from "firebase-admin";
import serviceAccountKey from "../../serviceAccountKey.json";
import devicesRouter from "./devices";
import topicsRouter from "./topics";
import notificationsRouter from "./notifications";

// Initialize Firebase Admin SDK with your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
});

const app = express();
const port = 7363;

app.use(express.json());

app.use("/api/topics", topicsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/notifications", notificationsRouter);

ViteExpress.listen(app, port, () =>
  console.log("Server is listening on port", port)
);
