import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First Name must be at least 3 characters"],
      maxlength: [20, "First Name cannot exceed 20 characters"],
    },

    lastName: {
      type: String,
      required: true,
      minlength: [3, "Last Name must be at least 3 characters"],
      maxlength: [20, "Last Name cannot be more than 20 characters"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 Characters"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export { User };
