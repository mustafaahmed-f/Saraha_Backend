import { faker } from "@faker-js/faker";
import messageModel from "../../DB/model/Message.model.js";

export async function generateFakeMsg() {
  let messages = [];
  for (let index = 0; index < 60; index++) {
    messages.push({
      sentTo: "mustafaAhmed97",
      content: ` ${faker.word.words(20)}`,
      sentBy: "65fa03b71050d6f10f5df2f6",
    });
  }

  const sendMsg = await messageModel.insertMany(messages);
  if (!sendMsg) throw new Error("Failed !!");
}
