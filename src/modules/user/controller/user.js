import userModel from "../../../../DB/Model/user.model.js";
import cloudinary from "../../../utils/cloud.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import Cryptr from "cryptr";

export const update = asyncHandler(async (req, res, next) => {
  const { userName, age, phone } = req.body;
  const cryptr = new Cryptr(process.env.CrptPHONE);
  const encrptPhone = cryptr.encrypt(phone);
  const user = await userModel.findOneAndUpdate(
    { _id: req.user.id },
    { userName, age, phone: encrptPhone }
  );
  return res.status(200).json({ message: "Done", user });
});

export const deletedAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.updateOne(
    { _id: req.user.id },
    { isDeleted: true }
  );
  return res.status(200).json({ message: "Done", user });
});

export const profilePic = asyncHandler(async (req, res, next) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Trello/user/image/${req.user.id}`,
    }
  );
  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      profilePic: { secure_url, public_id },
    },
    { new: true }
  );

  return res.status(200).json({ message: "Done", user });
});

export const profileCover = asyncHandler(async (req, res, next) => {
  const coverImages = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `Trello/user/Album/${req.user.id}`,
      }
    );
    coverImages.push({ secure_url, public_id });
  }
  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      profileCover: coverImages,
    },
    { new: true }
  );

  return res.status(200).json({ message: "Done", user });
});
