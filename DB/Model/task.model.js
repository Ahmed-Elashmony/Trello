import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    assignTo: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "toDo",
      enum: ["toDo", "Done", "Doing"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const taskModel = model("Task", taskSchema);
export default taskModel;
