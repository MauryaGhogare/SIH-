import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: function () {
        return !this.phone; 
      },
      unique: true, 
      sparse: true, 
    },
    phone: {
      type: String,
      required: function () {
        return !this.email; 
      },
      unique: true, 
      sparse: true, 
    },
    password: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;