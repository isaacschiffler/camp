import { Campsite } from "../models";
import { Schema, model, ObjectId, Types } from "mongoose";

const CampsiteSchema = new Schema<Campsite>(
  {
    title: { type: String, required: true, trim: true },
    images: [String],
    region: String,
    features: [String],
    amenities: [String],
  },
  { collection: "campsites" }
);

const CampsiteModel = model<Campsite>("Campsite", CampsiteSchema);

function index(): Promise<Campsite[]> {
  return CampsiteModel.find();
}

function get(id: string): Promise<Campsite> {
  return CampsiteModel.findById(id)
    .then((site) => {
      if (!site) {
        throw new Error();
      } else {
        return site;
      }
    })
    .catch((err) => {
      throw `${err} Campsite Not Found`;
    });
}

function create(json: Campsite): Promise<Campsite> {
  const t = new CampsiteModel(json);
  return t.save();
}

function update(id: string, site: Campsite): Promise<Campsite> {
  return CampsiteModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, site, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated as Campsite;
  });
}

function remove(id: string): Promise<void> {
  return CampsiteModel.findOneAndDelete({ _id: new Types.ObjectId(id) }).then(
    (deleted) => {
      if (!deleted) throw `${id} not deleted`;
    }
  );
}

export default { index, get, create, update, remove };
