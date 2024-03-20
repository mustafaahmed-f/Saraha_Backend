import userModel from "../../../../DB/model/User.model.js";
import cloudiay from "../../../utils/cloudConf.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { qrCodeGeneration } from "../../../utils/qrCodeFunction.js";
import bcrypt from "bcryptjs";

//========================== Get User Data=============================
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  return res.json({
    message: "Done",
    user_Details: {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    },
  });
});

//=================================== update password =====================

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { password, rePassword } = req.body;
  if (password !== rePassword)
    return next(
      new Error("Re-password should be same as password !", { cause: 400 })
    );
  const hashedPass = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: hashedPass,
    },
    { new: true }
  );

  if (!updatedUser)
    return next(new Error("Failed to update user !!", { cause: 500 }));

  return res
    .status(200)
    .json({ message: "Password has been update Successfully !!" });
});

//============================ update profile =============================
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { lastName, firstName, userName } = req.body;

  const checkDublicatedUserName = await userModel.findOne({ userName });
  if (checkDublicatedUserName) {
    return next(new Error("userName is already in use !!", { cause: 400 }));
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    _id,
    {
      lastName,
      firstName,
      userName,
    },
    {
      new: true,
    }
  );

  if (!updatedUser)
    return next(new Error("Failed to update user", { cause: 500 }));

  return res.status(200).json({ message: "Update done" });
});

//============================ delete profile =============================
export const deleteProfile = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const { userId } = req.query;

  // _id.toString() or !=
  if (_id != userId) {
    return next(new Error("unAuthorized", { cause: 401 }));
  }

  await userModel.findByIdAndDelete(_id);

  return res.status(200).json({ message: "deleted done" });
});

//================================ Log out ===============================

export const logOut = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { authorization } = req.headers;

  const logOutUser = await userModel.findByIdAndUpdate(_id, {
    $pull: { tokens: authorization.split(process.env.TOKEN_BEARER)[1] },
  });

  if (!logOutUser) return next(new Error("failed to log out", { cause: 500 }));
  return res.status(200).json({ message: "Logged out !!" });
});
