import { faker } from "@faker-js/faker";
import messageModel from "../../DB/model/Message.model.js";

export async function generateFakeMsg() {
  let messages = [];
  for (let index = 0; index < 10; index++) {
    messages.push({
      sentTo: "mustafaAhmed123456",
      content: `sentBy mustafa after modification ${faker.word.words(20)}`,
      sentBy: "65f2dade7340933c4f3e543a",
    });
  }

  const sendMsg = await messageModel.insertMany(messages);
  if (!sendMsg) throw new Error("Failed !!");
}
