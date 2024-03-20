import userModel from "../../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import { SuccessResponse, asyncHandler } from "../../../utils/errorHandling.js";

import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";

import jwt from "jsonwebtoken";
import sendEmail from "../../../utils/email.js";

export const signup = asyncHandler(async (req, res, next) => {
  // http://localhost:5000
  console.log(req.basURL);
  console.log(req.headers.host);
  const { firstName, lastName, userName, email, password } = req.body;

  const checkUser = await userModel.findOne({ email }); // {} , null
  if (checkUser) {
    return next(new Error("Email Exist", { cause: StatusCodes.CONFLICT }));
  }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  const user = await userModel.create({
    firstName,
    lastName,
    userName,
    email,
    password: hashPassword,
  });

  const html = `<!DOCTYPE html>
  <html>
  <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
  <style type="text/css">
  body{background-color: #88BDBF;margin: 0px;}
  </style>
  <body style="margin:0px;">
  <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
  <tr>
  <td>
  <table border="0" width="100%">
  <tr>
  <td>
  <h1>
      <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
  </h1>
  </td>
  <td>
  <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  <tr>
  <td>
  <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
  <tr>
  <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
  <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
  </td>
  </tr>
  <tr>
  <td>
  <h1 style="padding-top:25px; color:#630E2B">Signed up successfully</h1>
  </td>
  </tr>
  <tr>
  <td>
  <p style="padding:0px 100px;">
  </p>
  </td>
  </tr>
  <tr>
  <td>
  <a href="http://localhost:5173/login" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Login to your account</a>
  </td>
  </tr>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>

  </table>
  </td>
  </tr>
  <tr>
  <td>
  <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
  <tr>
  <td>
  <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
  </td>
  </tr>
  <tr>
  <td>
  <div style="margin-top:20px;">

  <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>

  <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
  </a>

  <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
  </a>

  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </body>
  </html>`;
  await sendEmail({ to: email, subject: "Account created successfully", html });
  return SuccessResponse(
    res,
    { message: "Done", status: getReasonPhrase(StatusCodes.CREATED) },
    201
  );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }); // {} , null
  if (!user) {
    return next(new Error("Email not exist", { cause: 404 }));
  }

  const match = bcrypt.compareSync(password, user.password);

  if (!match) {
    return next(new Error("In-valid login data", { cause: 400 }));
  }

  const token = jwt.sign(
    { id: user._id, isLogged: true },
    process.env.LOGIN_SIGNATURE,
    { expiresIn: "1d" }
    // { expiresIn: 10 }
  );

  user.tokens.push(token);
  const saveToken = await user.save();
  if (!saveToken) return next(new Error("Failed to add token !"));

  return res.status(200).json({
    message: "Done",
    token,
    user_Details: {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    },
  });
});
