import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";

export const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization?.startsWith(process.env.TOKEN_BEARER)) {
    return next(
      new Error("authorization is required or In-valid Bearer key", {
        cause: 400,
      })
    );
  }

  const token = authorization.split(process.env.TOKEN_BEARER)[1];
  if (!token) {
    return next(new Error("token is required", { cause: 400 }));
  }

  const checkTokenExistence = await userModel.findOne({
    tokens: { $in: [token] },
  });
  if (!checkTokenExistence)
    return next(
      new Error("Token is not related to user or user is not found !!", {
        cause: 400,
      })
    );

  // console.log(req)
  try {
    const decoded = jwt.verify(token, process.env.LOGIN_SIGNATURE);
    if (!decoded?.id) {
      return next(new Error("In-valid  token payload", { cause: 400 }));
    }
    const user = await userModel
      .findById(decoded.id)
      .select("userName email _id"); // {}, null
    if (!user) {
      return next(new Error("Not register account", { cause: 401 }));
    }
    req.user = user;

    return next();
  } catch (error) {
    // refersh token
    if (error.message == "jwt expired") {
      const findUser = await userModel.findOne({
        tokens: { $in: [token] },
      });
      if (!findUser) {
        return next(new Error("wrong token", { cause: 400 }));
      }

      await userModel.updateOne(
        { _id: findUser._id },
        { $pull: { tokens: token } }
      );

      const userToken = jwt.sign(
        { id: findUser._id, isLogged: true },
        process.env.LOGIN_SIGNATURE,
        { expiresIn: "1h" }
      );

      const updatedUser = await userModel.updateOne(
        { _id: findUser._id },
        { $push: { tokens: userToken } }
      );

      if (!updatedUser)
        return next(new Error("Failed to update token !", { cause: 500 }));
      res.status(200).json({ message: "Token Refreshed !!", userToken });
    }
  }
});
