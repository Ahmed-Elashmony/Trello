import connectDB from "../DB/connection.js";
import { globalErrorHandler } from "./utils/errorHandling.js";
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import taskRouter from "./modules/task/task.router.js";

const bootstrap = (app, express) => {
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/task", taskRouter);

  app.use("*", (req, res) => {
    res.json({ message: "InVaild Path" });
  });

  app.use(globalErrorHandler);
  connectDB();
};

export default bootstrap;
