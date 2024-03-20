// import router from '../auth/auth.router.js'
import { auth } from "../../middleware/authuntication.js";
import * as mc from "./controller/message.js";
import { Router } from "express";
const router = Router();

router.post("/sendMessage", mc.sendMessage);
router.get("/getMessages", auth, mc.getMessages);
router.delete("/:messageId", auth, mc.deleteMessages);

export default router;
