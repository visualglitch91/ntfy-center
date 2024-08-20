import { Router } from "express";
import { difference } from "lodash-es";
import { listKnownTopics } from "./topics.utils";
import { devicesDB, subscribe, unsubscribe } from "./devices.utils";

const devicesRouter = Router();

devicesRouter.post<never, any, { token: string }>(
  "/register",
  async (req, res) => {
    const { token } = req.body;

    if (!devicesDB.has(token)) {
      devicesDB.set(token, { token, topics: [] });
      await subscribe(token, listKnownTopics());
    }

    return res.sendStatus(200);
  }
);

devicesRouter.post<never, any, { token: string; topics: string[] }>(
  "/topics/list",
  async (req, res) => {
    const device = devicesDB.get(req.body.token);

    if (!device) {
      throw new Error("Device not found");
    }

    return res.status(200).json(device.topics);
  }
);

devicesRouter.post<never, any, { token: string }>(
  "/topics/:topic/:action",
  async (req, res) => {
    const { token } = req.body;
    const { topic, action } = req.params;

    if (!devicesDB.has(token)) {
      throw new Error("Device not found");
    }

    if (action === "subscribe") {
      await subscribe(token, [topic]);
    } else if (action === "unsubscribe") {
      await unsubscribe(token, [topic]);
    } else {
      throw new Error("Unsupported action");
    }

    return res.sendStatus(200);
  }
);

export default devicesRouter;
