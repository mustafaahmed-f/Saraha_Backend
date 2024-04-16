// const { Schema } = require('mongoose')
import { Schema, Types, model } from "mongoose";

const messagesSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sentTo: {
      type: String,
      ref: "User",
      required: true,
    },
    sentBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = model("Message", messagesSchema);
export default messageModel;
