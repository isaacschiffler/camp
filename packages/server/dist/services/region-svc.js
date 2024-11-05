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
var region_svc_exports = {};
__export(region_svc_exports, {
  default: () => region_svc_default
});
module.exports = __toCommonJS(region_svc_exports);
var import_mongoose = require("mongoose");
const RegionSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    features: [String],
    climate: String
  },
  { collection: "regions" }
);
const RegionModel = (0, import_mongoose.model)("Region", RegionSchema);
function index() {
  return RegionModel.find();
}
function get(id) {
  return RegionModel.findById(id).then((region) => {
    if (!region) {
      throw new Error();
    } else {
      return region;
    }
  }).catch((err) => {
    throw `${err} Region Not Found`;
  });
}
function create(json) {
  const t = new RegionModel(json);
  return t.save();
}
function update(id, region) {
  return RegionModel.findOneAndUpdate({ _id: new import_mongoose.Types.ObjectId(id) }, region, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated;
  });
}
function remove(id) {
  return RegionModel.findOneAndDelete({ _id: new import_mongoose.Types.ObjectId(id) }).then(
    (deleted) => {
      if (!deleted) throw `${id} not deleted`;
    }
  );
}
var region_svc_default = { index, get, create, update, remove };
