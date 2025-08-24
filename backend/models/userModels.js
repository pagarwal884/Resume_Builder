// Import mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Define a schema for the User collection
const userSchema = new mongoose.Schema(
  {
    // Field: name of the user
    name: {
      type: String,   // Data type is String
      required: true, // Name is mandatory
    },
    // Field: email of the user
    email: {
      type: String,   // Data type is String
      required: true, // Email is mandatory
    },
    // Field: password of the user (hashed before storing)
    password: {
      type: String,   // Data type is String
      required: true, // Password is mandatory
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the User model based on the schema
// "User" will be the collection name in MongoDB (pluralized automatically as "users")
export default mongoose.model("User", userSchema);
