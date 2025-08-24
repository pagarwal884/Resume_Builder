// Import mongoose (MongoDB ODM library)
import mongoose from "mongoose";

// Define a schema (blueprint) for User collection
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,   // must be a string
      required: true, // cannot be empty
    },
    // User's email address
    email: {
      type: String,
      required: true, // cannot be empty
      // (💡 usually you'd also add `unique: true` to prevent duplicate emails)
    },
    // User's hashed password
    password: {
      type: String,
      required: true, // cannot be empty
    },
  },
  {
    // This option automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Create and export a Mongoose model named "User"
// Mongoose will create a "users" collection in MongoDB
export default mongoose.model("User", userSchema);
