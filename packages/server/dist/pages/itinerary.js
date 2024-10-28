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
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/itinerary.css"]
    });
  }
  renderBody() {
    const host = process.env.HOST || "";
    const memberList = import_server.html`
      <ul>
        ${this.data.members.map((mem) => import_server.html`<li>${mem.name}</li>`)}
      </ul>
    `;
    const campsiteList = this.data.location.campsite.map(
      (site) => import_server.html`<li>${site}</li>`
    );
    let activityList = import_server.html`
      <ul>
        <li>No Activities Planned Yet</li>
      </ul>
    `;
    if (this.data.activities) {
      activityList = import_server.html`
        <ul>
          ${this.data.activities.map((act) => import_server.html`<li>${act}</li>`)}
        </ul>
      `;
    }
    const gearList = import_server.html`
      ${this.data.gear.map(
      (item) => import_server.html` <label key=${item}>
            <input type="checkbox" autocomplete="off" />
            ${item}
          </label>`
    )}
    `;
    const imageList = this.data.image_urls;
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
      <h1>${this.data.title}</h1>
      <section class="four-sections">
        <section>
          <h2>Group:</h2>
          ${memberList}
        </section>
        <section>
          <h2>Location:</h2>
          <ul>
            <li>${this.data.location.region}</li>
            ${campsiteList}
          </ul>
        </section>
        <section>
          <h2>Activities:</h2>
          ${activityList}
        </section>
        <section class="gear-section">
          <h2>Gear:</h2>
          ${gearList}
        </section>
      </section>
      <section class="images">
        <img class="outer-img" src=${imageList[0]} />
        <img class="middle-img" src=${imageList[1]} />
        <img class="outer-img" src=${imageList[2]} />
      </section>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ItineraryPage
});
