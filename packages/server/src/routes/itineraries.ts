import express, { Request, Response } from "express";
import { Trip } from "../models/itinerary";

import Trips from "../services/itinerary-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Trips.index()
    .then((list: Trip[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:tripId", (req: Request, res: Response) => {
  const { tripId } = req.params;

  Trips.get(tripId)
    .then((trip: Trip) => res.json(trip))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newTrip = req.body;

  Trips.create(newTrip)
    .then((trip: Trip) => res.status(201).json(trip))
    .catch((err) => res.status(500).send(err));
});

router.put("/:tripId", (req: Request, res: Response) => {
  const { tripId } = req.params;
  const newTrip = req.body;

  Trips.update(tripId, newTrip)
    .then((trip: Trip) => res.json(trip))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:tripId", (req: Request, res: Response) => {
  const { tripId } = req.params;

  Trips.remove(tripId)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
