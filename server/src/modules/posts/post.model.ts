import mongoose, { Schema } from "mongoose";
import { TPost } from "../../types/post/post.type.js";

const PostSchema = new mongoose.Schema<TPost>({
    author: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],

    tags: [{
        type: String
    }],

    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Post", PostSchema);