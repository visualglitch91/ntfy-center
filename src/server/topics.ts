import { Router } from "express";
import { listKnownTopics } from "./topics.utils";

const topicsRouter = Router();

topicsRouter.get("/", (_, res) => {
  res.status(200).json(listKnownTopics());
});

export default topicsRouter;
