import mongoose, { Schema } from "mongoose";
import { TUser } from "../../@types/user/user.type.js";

const UserSchema = new mongoose.Schema<TUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  nameUser: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  biography: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  postsSaveds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  role: {
    type: String,
    enum: ["admin", "professor", "estudante", "user"],
    default: "user"
  },
});

export default mongoose.model("User", UserSchema);
