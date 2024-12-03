import { Trip, Campsite } from "server/models";

export interface Model {
  trip?: Trip;
  campsite?: Campsite;
}

export const init: Model = {};
