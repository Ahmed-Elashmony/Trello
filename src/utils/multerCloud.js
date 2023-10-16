import multer from "multer";

export const fileValidation = {
  image: ["image/jpg", "image/png"],
  file: ["application/pdf", "application/msword"],
};

export function uploadCloud(customeValidtion = []) {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (customeValidtion.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid format"), false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}
