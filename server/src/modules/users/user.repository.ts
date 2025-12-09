
import { TUser } from "../../types/user/user.type.js";
import userModel from "./user.model.js";

export const UserRepository = {
    findById(id: string){
        return userModel.findById(id).populate("postsSaveds");
    },

    findByEmail(email: string){
        return userModel.findOne({ email: email });
    },

    findByUserName(nameUser: string){
        return userModel.findOne({ nameUser: nameUser })
    },

    findAll(){
        return userModel.find();
    },

    update(id: string, data: Partial<TUser>){
        return userModel.findByIdAndUpdate(id, data, {
            new: true
        }).select("-password")
    },

    create(data: TUser){
        return userModel.create(data);
    },

}