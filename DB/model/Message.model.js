// const { Schema } = require('mongoose')
import { Schema, model } from "mongoose";

const messagesSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sendBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const messageModel = model("Message", messagesSchema);
