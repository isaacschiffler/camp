import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Trip } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "trip/select":
      selectTrip(message[1], user).then((trip) =>
        apply((model) => ({ ...model, trip }))
      );
      break;
    // put the rest of your cases here
    case "trip/save":
      saveTrip(message[1], user);
      break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message ${unhandled}`);
  }
}

function selectTrip(msg: { tripId: string }, user: Auth.User) {
  return fetch(`http://localhost:3000/api/itineraries/${msg.tripId}`, {
    headers: Auth.headers(user),
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("TRIP:", json);
        return json as Trip;
      }
    });
}

function saveTrip(msg: { tripId: string; trip: Trip }, user: Auth.User) {
  if (msg && user) {
    return true;
  }
  return true;
}
