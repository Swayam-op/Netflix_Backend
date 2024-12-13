import User from "../models/userModel";
import { User as prismaUser } from "@prisma/client";
import userType from "../types/userType";

async function createUser(userDetails : userType ):Promise<prismaUser>{
    console.log("userService/userDetail/createUser/before-creating-object", userDetails);
    const newUser = new User(userDetails);
    const saved_user = await newUser.saveToDb();
    console.log("userService/userDetail/createUser/after-saving-toDB", saved_user);
    return saved_user;
}

export {createUser};