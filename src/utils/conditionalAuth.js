import { auth } from "../middleware/authuntication.js";
import { asyncHandler } from "./errorHandling.js";

////Conditional auth is used with sendMessage method only so one can send message
////With logged in user or anonymously

export const conditionalAuth = asyncHandler((req, res, next) => {
  return new Promise(() => {
    if (req?.headers?.authorization) {
      auth(req, res, next);
    } else {
      next();
    }
  });
});
