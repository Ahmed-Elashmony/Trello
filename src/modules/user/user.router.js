import auth from "../../middelware/authtication.js";
import { validation } from "../../middelware/valdiation.js";
import * as validators from "./validation.js";
import * as userController from "./controller/user.js";
import { Router } from "express";
import { fileValidation, uploadCloud } from "../../utils/multerCloud.js";
const router = Router();

router.put(
  "/update",
  validation(validators.update),
  auth,
  userController.update
);

router.delete("/deletedAccount", auth, userController.deletedAccount);

router.put(
  "/profilePic",
  auth,
  uploadCloud(fileValidation.image).single("image"),
  userController.profilePic
);

router.put(
  "/profileCover",
  auth,
  uploadCloud(fileValidation.image).array("images", 5),
  userController.profileCover
);

export default router;
