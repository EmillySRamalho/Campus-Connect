import mongoose, { Schema } from "mongoose";
import { TStudent } from "../../@types/student/student.type.js";

const StudentSchema = new mongoose.Schema<TStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    avatarUrl: {
      type: String,
    },

    course: {
      type: String,
    },

    socialLinks: {
      github: String,
      linkedin: String,
      lattes: String,
    },

    xp: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", StudentSchema);
