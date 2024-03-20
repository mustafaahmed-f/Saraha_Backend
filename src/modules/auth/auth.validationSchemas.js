import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

// signUp
export const sginUpSchema = {
  body: joi
    .object({
      firstName: joi.string().min(3).max(20).required().messages({
        "any.required": "please fill your firstName",
        "string.max": "firstname must be less than 20",
      }),
      lastName: joi.string().min(3).max(20).required(),
      userName: joi.string().min(3).max(20).required(),
      email: generalFields.email,
      password: generalFields.password,
      // cPassword: joi.string().valid(joi.ref("password")).required(),
    })
    .required(),
};

// joi , express-validator
export const loginSchema = {
  body: joi
    .object({
      email: generalFields.email,
      password: generalFields.password,
    })
    .options({ presence: "required" })
    .required(),
};
