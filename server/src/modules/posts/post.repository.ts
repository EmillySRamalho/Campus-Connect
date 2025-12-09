import { Types } from "mongoose";
import postModel from "./post.model.js";
import { TCreatePostData } from "./services/PostAction.service.js";
import { TPost } from "../../types/post/post.type.js";

export const PostRepository = {
  findAll() {
    return postModel.find().populate({
      path: "author",
      populate: {
        path: "user", 
        select: "name emai role", 
      },
    });
  },

  findById(id: string) {
    return postModel.findById(id);
  },

  findPostByAuthor(id: string) {
    const objectId = new Types.ObjectId(id);
    return postModel.find({ author: objectId }).populate({
      path: "author", 
      populate: {
        path: "user",
        select: "name email role", 
      },
    });
  },

  create(data: TCreatePostData) {
    return postModel.create(data);
  },

  deleteById(id: string) {
    return postModel.findByIdAndDelete(id);
  },

  update(id: string, data: Partial<TPost>){
    return postModel.findByIdAndUpdate(id, data, { new: true });
  }

};
