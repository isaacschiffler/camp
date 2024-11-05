import express, { Request, Response } from "express";
import { Campsite } from "../models";

import Campsites from "../services/campsite-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Campsites.index()
    .then((list: Campsite[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:campsiteId", (req: Request, res: Response) => {
  const { campsiteId } = req.params;

  Campsites.get(campsiteId)
    .then((campsite: Campsite) => res.json(campsite))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newCampsite = req.body;

  Campsites.create(newCampsite)
    .then((campsite: Campsite) => res.status(201).json(campsite))
    .catch((err) => res.status(500).send(err));
});

router.put("/:campsiteId", (req: Request, res: Response) => {
  const { campsiteId } = req.params;
  const newCampsite = req.body;

  Campsites.update(campsiteId, newCampsite)
    .then((campsite: Campsite) => res.json(campsite))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:campsiteId", (req: Request, res: Response) => {
  const { campsiteId } = req.params;

  Campsites.remove(campsiteId)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
