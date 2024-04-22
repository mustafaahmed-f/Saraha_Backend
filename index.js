import dotenv from "dotenv";
dotenv.config();

import bootstrap from "./src/index.router.js";
import express from "express";

import { generateFakeMsg } from "./src/utils/fakeMessages.js";

const app = express();
const port = process.env.PORT || 3000;

bootstrap(app, express);

//// Function to generate fake messages for testing :
// generateFakeMsg();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
