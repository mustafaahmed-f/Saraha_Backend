import connectDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import messageRouter from "./modules/message/message.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import cors from "cors";

const bootstrap = (app, express) => {
  app.use(express.json());
  app.use(cors());
  app.get("/", (req, res) => {
    return res.send("Hello SARAHA!!");
  });

  const baseURL = "/saraha";

  app.use(`${baseURL}/auth`, authRouter);
  app.use(`${baseURL}/user`, userRouter);
  app.use(`${baseURL}/msg`, messageRouter);
  app.use("*", (req, res) => res.send("In-valid Routing"));

  app.use(globalErrorHandling);

  connectDB();
};

export default bootstrap;
