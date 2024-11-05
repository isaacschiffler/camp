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
var campsite_svc_exports = {};
__export(campsite_svc_exports, {
  default: () => campsite_svc_default
});
module.exports = __toCommonJS(campsite_svc_exports);
var import_mongoose = require("mongoose");
const CampsiteSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    images: [String],
    region: String,
    features: [String],
    amenities: [String]
  },
  { collection: "campsites" }
);
const CampsiteModel = (0, import_mongoose.model)("Campsite", CampsiteSchema);
function index() {
  return CampsiteModel.find();
}
function get(id) {
  return CampsiteModel.findById(id).then((site) => {
    if (!site) {
      throw new Error();
    } else {
      return site;
    }
  }).catch((err) => {
    throw `${err} Campsite Not Found`;
  });
}
function create(json) {
  const t = new CampsiteModel(json);
  return t.save();
}
function update(id, site) {
  return CampsiteModel.findOneAndUpdate({ _id: new import_mongoose.Types.ObjectId(id) }, site, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated;
  });
}
function remove(id) {
  return CampsiteModel.findOneAndDelete({ _id: new import_mongoose.Types.ObjectId(id) }).then(
    (deleted) => {
      if (!deleted) throw `${id} not deleted`;
    }
  );
}
var campsite_svc_default = { index, get, create, update, remove };
