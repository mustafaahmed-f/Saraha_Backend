// import router from '../auth/auth.router.js'
import { auth } from "../../middleware/authuntication.js";
import { conditionalAuth } from "../../utils/conditionalAuth.js";
import * as mc from "./controller/message.js";
import { Router } from "express";
const router = Router();

router.post("/sendMessage/:sentTo", conditionalAuth, mc.sendMessage);
router.get("/getMessages", auth, mc.getMessages);
router.get("/getSentMessages", auth, mc.getSentMessages);
router.get("/numOfMessages", auth, mc.numOfMessages);
router.delete("/deleteMessage/:messageId", auth, mc.deleteMessages);
router.delete("/emptyInbox", auth, mc.emptyInbox);

export default router;
