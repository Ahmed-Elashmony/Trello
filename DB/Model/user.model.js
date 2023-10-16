import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: Number,
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    phone: String,
    isOnline: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    ConfirmEmail: {
      type: Boolean,
      default: false,
    },
    profilePic: { secure_url: String, public_id: String },
    profileCover: [{ secure_url: String, public_id: String }],
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);
export default userModel;
