import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandling.js";
import userModel from "../../DB/Model/user.model.js";

const auth = asyncHandler(async (req, res, next) => {
  const { token } = req.headers;
  if (!token?.startsWith(process.env.BearerToken)) {
    return next(new Error("token require or invaild key", { cause: 400 }));
  }
  const auth = token.split(process.env.BearerToken)[1];
  if (!auth) {
    return next(new Error("token required", { cause: 401 }));
  }
  const decoded = jwt.verify(auth, process.env.TokenSignutrue);
  if (!decoded?.id) {
    return next(new Error("inVaild Payload", { cause: 400 }));
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("Not Register Account", { cause: 404 }));
  }
  if (!user.isOnline) {
    return next(new Error("LogIn First", { cause: 400 }));
  }
  if (user.isDeleted) {
    return next(
      new Error("Ur Acc is Deleted LogIn to return it", { cause: 400 })
    );
  }
  req.user = user;
  return next();
});

export default auth;
