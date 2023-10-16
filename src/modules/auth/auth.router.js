import auth from "../../middelware/authtication.js";
import { validation } from "../../middelware/valdiation.js";
import * as validators from "./validation.js";
import * as authController from "./controller/auth.js";
import { Router } from "express";
const router = Router();

router.post("/SignUp", validation(validators.SignUp), authController.SignUp);

router.get("/confirmEmail/:token", authController.confirmEmail);

router.get("/newConfirmEmail/:token", authController.newConfirmEmail);

router.get("/SignInPage", authController.SignInPage);

router.get("/SignUpPage", authController.SignUpPage);

router.post("/logIn", validation(validators.logIn), authController.logIn);

router.patch(
  "/changePassword",
  auth,
  validation(validators.changePassword),
  authController.changePassword
);

router.patch("/logOut", auth, authController.logOut);

export default router;
