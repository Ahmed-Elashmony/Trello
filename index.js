import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bootstrap from "./src/index.router.js";
import { deleteUnConfirmedEmails } from "./src/utils/cronJob.js";
const app = express();
const port = 3000;

bootstrap(app, express);

app.use("/uploads", express.static("./uploads"));

deleteUnConfirmedEmails();

app.listen(port, () => console.log(`Server is Running on port ${port}!`));
