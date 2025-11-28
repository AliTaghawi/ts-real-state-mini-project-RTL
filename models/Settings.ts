import { Schema, model, models } from "mongoose";

interface SettingsTypes {
  _id: Schema.Types.ObjectId;
  homePageSliders: {
    newest: boolean;
    apartment: boolean;
    store: boolean;
    office: boolean;
    villaLand: boolean;
  };
  homePageSections: {
    hero: boolean;
    categories: boolean;
    fileTypes: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const settingsSchema = new Schema<SettingsTypes>(
  {
    homePageSliders: {
      type: {
        newest: { type: Boolean, default: true },
        apartment: { type: Boolean, default: true },
        store: { type: Boolean, default: true },
        office: { type: Boolean, default: true },
        villaLand: { type: Boolean, default: true },
      },
      default: {
        newest: true,
        apartment: true,
        store: true,
        office: true,
        villaLand: true,
      },
    },
    homePageSections: {
      type: {
        hero: { type: Boolean, default: true },
        categories: { type: Boolean, default: true },
        fileTypes: { type: Boolean, default: true },
      },
      default: {
        hero: true,
        categories: true,
        fileTypes: true,
      },
    },
  },
  { timestamps: true }
);

const Settings = models.Settings || model("Settings", settingsSchema);

export default Settings;

