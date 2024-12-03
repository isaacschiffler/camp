import { Trip } from "server/models";

export type Msg =
  | [
      "trip/save",
      {
        tripId: string;
        trip: Trip;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | ["trip/select", { tripId: string }];
