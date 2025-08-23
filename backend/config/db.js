import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://pagarwal1145:pagarwal1145@cluster0.fyxhv4v.mongodb.net/"
    )
    .then(() => console.log("DB CONNECTED"));
};
