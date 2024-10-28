import { Trip, User, Location } from "../models";
import { Schema, model } from "mongoose";

const TripSchema = new Schema<Trip>(
  {
    title: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    members: [Object],
    location: { type: Object, required: true },
    activities: [String],
    gear: [String],
    image_urls: [String],
  },
  { collection: "trips" }
);

const TripModel = model<Trip>("Trip", TripSchema);

function index(): Promise<Trip[]> {
  return TripModel.find();
}

function get(tripId: string): Promise<Trip> {
  return TripModel.find({ tripId })
    .then((list) => list[0])
    .catch((err) => {
      throw `${err} Trip Not Found`;
    });
}

export default { index, get };

// -------------- MOCK DATA ------------------

const users: Array<User> = [
  { name: "Isaac Schiffler", id: 1 },
  { name: "Jack Olson", id: 2 },
  { name: "Paxton Rech", id: 3 },
  { name: "Charlie Swanson", id: 4 },
  { name: "Ben Christians", id: 5 },
  { name: "Parker Dustin", id: 6 },
];

const location1: Location = {
  region: "Yellowstone National Park",
  campsite: ["Campsite 2Y1"],
};

const trips: { [key: string]: Trip } = {
  yellowstone1: {
    title: "Trip to Yellowstone",
    startDate: new Date("2024-06-25"),
    endDate: new Date("2024-07-01"),
    members: users,
    location: location1,
    activities: ["Fly Fishing", "Hiking", "Hunting"],
    gear: [
      "Med Supplies",
      "Tent",
      "Pots and Pans",
      "Bug Spray",
      "Bear Spray",
      "Bear Rope",
    ],
    image_urls: [
      "/images/2Y1.jpeg",
      "/images/fishing.jpeg",
      "/images/fishing3.jpeg",
    ],
  },
  //   glacier1: undefined,
  //   yellowstone2: undefined,
};

export function getTrip(_: string): Trip {
  return trips["yellowstone1"];
}
