// ================= IMPORT MONGOOSE =================
// [commit: imported mongoose for MongoDB object modeling]
import mongoose from "mongoose";


// ================= CONNECT DATABASE FUNCTION =================
// [commit: async function to establish connection with MongoDB Atlas]
export const connectDB = async () => {
  await mongoose
    // [commit: connect method with MongoDB Atlas URI]
    .connect(
      "mongodb+srv://pagarwal1145:pagarwal1145@cluster0.fyxhv4v.mongodb.net/"
      // ✅ Note: DB name is not specified, Mongo will connect to default 'test' DB unless specified
    )

    // [commit: once connection is successful, log message]
    .then(() => console.log("DB CONNECTED"));
};
