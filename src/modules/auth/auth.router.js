import express from "express";
import { validationCoreFunction } from "../../middleware/validation.js";
import { loginSchema, sginUpSchema } from "./auth.validationSchemas.js";
import * as authController from "./controller/auth.js";
import { Router } from "express";
const router = Router();

router.post(
  "/signup",
  validationCoreFunction(sginUpSchema),
  authController.signup
);
router.post(
  "/login",
  validationCoreFunction(loginSchema),
  authController.login
);

// router.get('/confirmEmail/:token', authController.confirmEmail)
// router.get('/newConfirmEmail/:token', authController.newConfirmEmail)

export default router;
