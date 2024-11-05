import express, { Request, Response } from "express";
import { Region } from "../models";

import Regions from "../services/region-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Regions.index()
    .then((list: Region[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:regionId", (req: Request, res: Response) => {
  const { regionId } = req.params;

  Regions.get(regionId)
    .then((region: Region) => res.json(region))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newRegion = req.body;

  Regions.create(newRegion)
    .then((region: Region) => res.status(201).json(region))
    .catch((err) => res.status(500).send(err));
});

router.put("/:regionId", (req: Request, res: Response) => {
  const { regionId } = req.params;
  const newRegion = req.body;

  Regions.update(regionId, newRegion)
    .then((region: Region) => res.json(region))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:regionId", (req: Request, res: Response) => {
  const { regionId } = req.params;

  Regions.remove(regionId)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
