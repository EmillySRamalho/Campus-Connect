import { Types } from "mongoose";
import { TGroup } from "../../@types/group/group.type.js";
import groupModel from "./group.model.js";

export const GroupRepository = {
  findById(id: string) {
    return groupModel.findById(id).populate({
      path: "author",
      populate: {
        path: "user",
        select: "name email role",
      },
    }).populate({
      path: "members",
      select: "name email role"
    });
  },

  findByAuthor(id: string) {
    return groupModel.find({ author: id }).populate({
      path: "author",
      populate: {
        path: "user",
        select: "name email role",
      },
    });
  },

  findByUser(id: string | undefined) {
    return groupModel
      .find({
        $or: [
          { members: new Types.ObjectId(id) },
          { author: new Types.ObjectId(id) },
        ],
      })
      .populate("members", "name email");
  },

  update(id: string, data: Partial<TGroup>) {
    return groupModel.findByIdAndUpdate(id, data, { new: true });
  },

  create(data: TGroup) {
    return groupModel.create(data);
  },

  delete(id: string) {
    return groupModel.findByIdAndDelete(id);
  },
};
