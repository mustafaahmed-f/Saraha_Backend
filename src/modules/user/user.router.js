import { auth } from "../../middleware/authuntication.js";
import * as userController from "./controller/user.js";
import { Router } from "express";
const router = Router();

router.get("/getUser", auth, userController.getUserProfile);
router.put("/updateProfile", auth, userController.updateProfile);
router.delete("/deleteProfile", auth, userController.deleteProfile);
router.patch("/updatePassword", auth, userController.updatePassword);
router.patch("/logOut", auth, userController.logOut);

export default router;
