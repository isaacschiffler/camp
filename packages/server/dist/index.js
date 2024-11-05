"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_itinerary = require("./pages/itinerary");
var import_auth = require("./pages/auth");
var import_mongo = require("./services/mongo");
var import_itinerary_svc = __toESM(require("./services/itinerary-svc"));
var import_itineraries = __toESM(require("./routes/itineraries"));
var import_campsites = __toESM(require("./routes/campsites"));
var import_regions = __toESM(require("./routes/regions"));
var import_auth2 = __toESM(require("./routes/auth"));
(0, import_mongo.connect)("backpack");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use("/auth", import_auth2.default);
app.use("/api/itineraries", import_itineraries.default);
app.use("/api/campsites", import_campsites.default);
app.use("/api/regions", import_regions.default);
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.get("/itinerary/:tripId", (req, res) => {
  const { tripId } = req.params;
  import_itinerary_svc.default.get(tripId).then((data) => {
    res.set("Content-Type", "text/html").send(new import_itinerary.ItineraryPage(data).render());
  }).catch((err) => {
    res.status(404).send("Trip not found: " + err);
  });
});
app.get("/login", (req, res) => {
  const page = new import_auth.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
