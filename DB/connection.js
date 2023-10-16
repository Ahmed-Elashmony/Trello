import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(`${process.env.DB_URL}`)
    .then((result) => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log("Fail to connected DB", error);
    });
};

export default connectDB;
