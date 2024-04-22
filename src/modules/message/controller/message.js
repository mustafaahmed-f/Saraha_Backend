import mongoose from "mongoose";
import messageModel from "../../../../DB/model/Message.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { auth } from "../../../middleware/authuntication.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

//======================== send message ========================
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const { sentTo } = req.params;

  console.log(content);

  //// we should get sentBy from auth .. if there is an authorization field in the header of the request..

  if (content.length > 1000)
    return next(
      new Error("Message shouldn't be more than 1000 characters ", {
        cause: 400,
      })
    );

  // usercheck
  const isUserExists = await userModel.findOne({ userName: sentTo });
  if (!isUserExists) {
    return next(new Error("invaid user", { cause: 400 }));
  }

  let newMsgObj = {
    content,
    sentTo,
  };

  //// check sender existence:
  //// SendBy should by the id of the sender ///

  if (req?.user) {
    newMsgObj.sentBy = req?.user?._id;
  }

  const newMessage = await messageModel.create(newMsgObj);
  if (!newMessage)
    return next(new Error("Failed to send message", { cause: 500 }));
  return res
    .status(200)
    .json({ message: "Message has been sent successfully !!" });
});

//======================== get recieved messages for loggedIn User =====================
export const getMessages = asyncHandler(async (req, res, next) => {
  const { userName } = req.user;

  const apiFeaturesInstance = new ApiFeatures(
    messageModel.find({
      sentTo: userName,
    }),
    req.query
  )
    .sort()
    .pagination();

  const messages = await apiFeaturesInstance.mongooseQuery.populate({
    path: "sentBy",
    select: "userName",
  });

  if (messages.length) {
    return res.status(200).json({ message: "done", messages });
  }
  return res.status(200).json({ message: "empty inbox" });
});

//======================== get messages send by user ===========================

export const getSentMessages = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);
  console.log(mongoose.Types.ObjectId.isValid(_id));
  const apiFeaturesInstance = new ApiFeatures(
    messageModel.find({
      sentBy: _id,
    }),
    req.query
  )
    .sort()
    .pagination();

  const messages = await apiFeaturesInstance.mongooseQuery;

  console.log(messages);

  if (messages.length) {
    return res.status(200).json({ message: "done", messages });
  }
  return res.status(200).json({ message: "empty inbox" });
});

//======================== delete message ========================
export const deleteMessages = asyncHandler(async (req, res, next) => {
  const { userName } = req.user;
  const { messageId } = req.params;

  const message = await messageModel.findOneAndDelete({
    _id: messageId,
    sentTo: userName,
  });

  if (!message) {
    return next(new Error("fail to delete", { cause: 400 }));
  }
  res.status(200).json({ message: "Message has been deleted successfully" });
});

//=========================== Empty inbox =======================

export const emptyInbox = asyncHandler(async (req, res, next) => {
  const { userName } = req.user;

  const messages = await messageModel.deleteMany({
    sentTo: userName,
  });

  if (!messages.deletedCount)
    return next(new Error("Your inbox is already empty", { cause: 400 }));

  return res.status(200).json({ message: "Your inbox is now empty !" });
});

//=========================== Get number of messages =======================

export const numOfMessages = asyncHandler(async (req, res, next) => {
  const { userName } = req.user;

  const messages = await messageModel.countDocuments({
    sentTo: userName,
  });

  // console.log(messages);

  if (!messages)
    return next(new Error("Your inbox is already empty", { cause: 400 }));

  return res.status(200).json({ message: "Done", number: messages });
});

//=========================== Get number of sent messages =======================

export const numOfSentMessages = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const messages = await messageModel.countDocuments({
    sentBy: _id,
  });

  // console.log(messages);

  if (!messages)
    return next(new Error("Your inbox is already empty", { cause: 400 }));

  return res.status(200).json({ message: "Done", number: messages });
});
