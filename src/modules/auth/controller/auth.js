import userModel from "../../../../DB/Model/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import Cryptr from "cryptr";
import bcrypt from "bcryptjs";
import sendEmail from "../../../utils/email.js";
import jwt from "jsonwebtoken";

export const SignUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, age, gender, phone } = req.body;
  const checkEmail = await userModel.findOne({ email });
  if (checkEmail) {
    return next(new Error("Email is Registered Before", 400));
  }
  const checkUser = await userModel.findOne({ userName });
  if (checkUser) {
    return next(new Error("UserName must be unique", 400));
  }
  const hashPass = bcrypt.hashSync(password, +process.env.SALT_ROUND);
  const cryptr = new Cryptr(process.env.CrptPHONE);
  const encryptPhone = cryptr.encrypt(phone);

  const user = await userModel.create({
    userName,
    email,
    password: hashPass,
    age,
    gender,
    phone: encryptPhone,
  });

  const token = jwt.sign({ id: user._id, email }, process.env.TokenSignutrue, {
    expiresIn: 60 * 2,
  });

  const newToken = jwt.sign(
    { id: user._id, email },
    process.env.TokenSignutrue,
    {
      expiresIn: 60 * 60 * 24 * 30,
    }
  );

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const newConfrimToken = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${newToken}`;

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
  <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
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
  <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
  </td>
  </tr>
  <br>
  <tr>
  <td>
  <a href="${newConfrimToken}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">New Verify Email address</a>
  </td>
  </tr>
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

  await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html,
  });
  return res.status(200).json({ message: "Done", user });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.TokenSignutrue);
  const user = await userModel.findByIdAndUpdate(
    decoded.id,
    {
      ConfirmEmail: true,
    },
    { new: true }
  );
  return user
    ? res.redirect("http://localhost:3000/auth/SignInPage")
    : res.send(
        `<a href="http://localhost:3000/auth/SignUpPage">Ops u look like u dont have account yet follow me to signUp</a>`
      );
});

export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.TokenSignutrue);
  const user = await userModel.findById(decoded.id);
  if (!user) {
    `<a href="http://localhost:3000/auth/SignUpPage">Ops u look like u dont have account yet follow me to signUp</a>`;
  }
  if (user.confirmEmail) {
    res.redirect("http://localhost:3000/auth/SignInPage");
  }
  const newToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TokenSignutrue,
    {
      expiresIn: 60 * 1,
    }
  );
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;

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
  <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
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
  <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
  </td>
  </tr>
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

  await sendEmail({
    to: user.email,
    subject: "Confirmation",
    html,
  });
  return res.send(`<p>Check Your inbox now </p>`);
});

export const SignInPage = asyncHandler(async (req, res) => {
  res.json({ message: "SIGN IN PAGE" });
});

export const SignUpPage = asyncHandler(async (req, res) => {
  res.json({ message: "SignUp Page" });
});

export const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const checkEmail = await userModel.findOne({ email });
  if (!checkEmail) {
    return next(new Error("Email not found"), { cause: 404 });
  }
  if (!checkEmail.ConfirmEmail) {
    return next(new Error("Please confirm your email"), { cause: 404 });
  }
  const checkPass = bcrypt.compareSync(password, checkEmail.password);
  if (!checkPass) {
    return next(new Error("Password Wrong"), { cause: 400 });
  }
  const token = jwt.sign(
    { id: checkEmail.id, email: checkEmail.email },
    process.env.TokenSignutrue,
    {
      expiresIn: 60 * 60 * 24 * 30,
    }
  );
  const online = await userModel.findByIdAndUpdate(checkEmail.id, {
    isOnline: true,
  });
  const deleted = await userModel.findByIdAndUpdate(checkEmail.id, {
    isDeleted: false,
  });
  const BerareToken = process.env.BearerToken + token;
  return res.status(200).json({ message: "Done", BerareToken });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  if (!req.user.ConfirmEmail) {
    return next(new Error("Please confirm your email"), { cause: 400 });
  }
  const checkPass = bcrypt.compareSync(oldPassword, req.user.password);
  if (!checkPass) {
    return next(new Error("Password is Wrong", { cause: 400 }));
  }
  const hashPass = bcrypt.hashSync(password, +process.env.SALT_ROUND);
  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    { password: hashPass },
    { new: true }
  );
  return res.status(200).json({ message: "Done", user });
});

export const logOut = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user.id, {
    isOnline: false,
  });
  return res.status(200).json({ message: "Done", user });
});
