import { Trip } from "server/models";

export type Msg =
  | ["trip/save", { tripId: string; trip: Trip }]
  | ["trip/select", { tripId: string }];
