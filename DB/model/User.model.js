import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    gender: { type: String, default: "male", enum: ["male", "female"] },
    tokens: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.virtual("Emails_Recieved", {
  ref: "Message",
  localField: "_id",
  foreignField: "sendTo",
});

userSchema.virtual("Emails_sent", {
  ref: "Message",
  localField: "_id",
  foreignField: "sendBy",
});

const userModel = model("User", userSchema);
export default userModel;
