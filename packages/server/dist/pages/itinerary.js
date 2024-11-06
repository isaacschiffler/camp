"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var itinerary_exports = {};
__export(itinerary_exports, {
  ItineraryPage: () => ItineraryPage
});
module.exports = __toCommonJS(itinerary_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class ItineraryPage {
  data;
  constructor(data) {
    this.data = data;
  }
  formatDate(date) {
    const options = {
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    };
    const dateFormat = new Intl.DateTimeFormat("en-US", options).format(date);
    return this.formatOrdinalDate(dateFormat);
  }
  formatOrdinalDate(dateString) {
    const [month, day] = dateString.split(" ");
    const dayNumber = parseInt(day, 10);
    let suffix;
    if (dayNumber === 1 || dayNumber === 21 || dayNumber === 31) suffix = "st";
    else if (dayNumber === 2 || dayNumber === 22) suffix = "nd";
    else if (dayNumber === 3 || dayNumber === 23) suffix = "rd";
    else suffix = "th";
    return `${month} ${dayNumber}${suffix}`;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/itinerary.css"]
    });
  }
  renderBody() {
    const host = process.env.HOST || "https://ischiffl.csse.dev/";
    const tripId = this.data._id.toString();
    return import_server.html`
      <header>
        <a href="${host}index.html">
          <h1 class="logo">Backpack</h1>
        </a>
        <a href="${host}profile.html">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#account" />
          </svg>
        </a>
      </header>
      <header class="nav">
        <a href="${host}index.html">
          <svg class="icon">
            <use href="/icons/sprite.svg#back" />
          </svg>
          <svg class="icon">
            <use href="/icons/sprite.svg#home" />
          </svg>
        </a>
      </header>
      <itinerary-element src="/api/itineraries/${tripId}"></itinerary-element>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ItineraryPage
});
