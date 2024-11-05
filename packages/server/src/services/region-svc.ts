import { Region } from "../models";
import { Schema, model, Types } from "mongoose";

const RegionSchema = new Schema<Region>(
  {
    title: { type: String, required: true, trim: true },
    features: [String],
    climate: String,
  },
  { collection: "regions" }
);

const RegionModel = model<Region>("Region", RegionSchema);

function index(): Promise<Region[]> {
  return RegionModel.find();
}

function get(id: string): Promise<Region> {
  return RegionModel.findById(id)
    .then((region) => {
      if (!region) {
        throw new Error();
      } else {
        return region;
      }
    })
    .catch((err) => {
      throw `${err} Region Not Found`;
    });
}

function create(json: Region): Promise<Region> {
  const t = new RegionModel(json);
  return t.save();
}

function update(id: string, region: Region): Promise<Region> {
  return RegionModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, region, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated as Region;
  });
}

function remove(id: string): Promise<void> {
  return RegionModel.findOneAndDelete({ _id: new Types.ObjectId(id) }).then(
    (deleted) => {
      if (!deleted) throw `${id} not deleted`;
    }
  );
}

export default { index, get, create, update, remove };
