import { createUser } from "../services/user.service";
import {Request, Response} from 'express';

export async function createUserHandler(req:Request, res:Response ):Promise<Response>{
    try{
        const userDetails = req.body;
        if(userDetails){
            const new_user = await createUser(userDetails);
            console.log("User got created successfully");
            return res.status(200).json({
                message : "User is created!",
                data : new_user
            })
        }
        throw Error("Invalid request")
    }
    catch(error){
            return res.status(400).json({
                message : "User couldn't be created",
                data : null
            })
        }
}