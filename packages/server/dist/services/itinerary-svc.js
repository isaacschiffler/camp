"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var itinerary_svc_exports = {};
__export(itinerary_svc_exports, {
  default: () => itinerary_svc_default
});
module.exports = __toCommonJS(itinerary_svc_exports);
var import_mongoose = require("mongoose");
const TripSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    members: [Object],
    location: { type: Object, required: true },
    activities: [String],
    gear: [String],
    image_urls: [String]
  },
  { collection: "trips" }
);
const TripModel = (0, import_mongoose.model)("Trip", TripSchema);
function index() {
  return TripModel.find();
}
function get(id) {
  return TripModel.findById(id).then((trip) => {
    if (!trip) {
      throw new Error();
    } else {
      return trip;
    }
  }).catch((err) => {
    throw `${err} Trip Not Found`;
  });
}
function create(json) {
  const t = new TripModel(json);
  return t.save();
}
function update(id, trip) {
  return TripModel.findOneAndUpdate({ _id: new import_mongoose.Types.ObjectId(id) }, trip, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated;
  });
}
function remove(id) {
  return TripModel.findOneAndDelete({ _id: new import_mongoose.Types.ObjectId(id) }).then(
    (deleted) => {
      if (!deleted) throw `${id} not deleted`;
    }
  );
}
var itinerary_svc_default = { index, get, create, update, remove };
const users = [
  { name: "Isaac Schiffler", id: 1 },
  { name: "Jack Olson", id: 2 },
  { name: "Paxton Rech", id: 3 },
  { name: "Charlie Swanson", id: 4 },
  { name: "Ben Christians", id: 5 },
  { name: "Parker Dustin", id: 6 }
];
const location1 = {
  region: "Yellowstone National Park",
  campsite: ["Campsite 2Y1"]
};
const trips = {
  yellowstone1: {
    title: "Trip to Yellowstone",
    startDate: /* @__PURE__ */ new Date("2024-06-25"),
    endDate: /* @__PURE__ */ new Date("2024-07-01"),
    members: users,
    location: location1,
    activities: ["Fly Fishing", "Hiking", "Hunting"],
    gear: [
      "Med Supplies",
      "Tent",
      "Pots and Pans",
      "Bug Spray",
      "Bear Spray",
      "Bear Rope"
    ],
    image_urls: [
      "/images/2Y1.jpeg",
      "/images/fishing.jpeg",
      "/images/fishing3.jpeg"
    ]
  }
  //   glacier1: undefined,
  //   yellowstone2: undefined,
};
