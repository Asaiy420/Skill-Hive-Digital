import { Schema, model, Document, Types } from "mongoose";

export interface ISavedCareer extends Document {
  userId: Types.ObjectId;
  careerId: Types.ObjectId;
  savedAt: Date;
}

const SavedCareerSchema = new Schema<ISavedCareer>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  careerId: {
    type: Schema.Types.ObjectId,
    ref: "Career",
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

SavedCareerSchema.index(
  { userId: 1, careerId: 1 },
  { unique: true }
);

export default model<ISavedCareer>(
  "SavedCareer",
  SavedCareerSchema
);