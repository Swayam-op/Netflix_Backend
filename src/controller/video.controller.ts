import {processVideo} from '../services/video.service';
import {Request, Response} from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import Video from '../models/video.model';

export const processVideoHandler = async(req:Request, res:Response)=>{
    const lessionId = uuidv4();
    const videoPath:string  = req.file? req.file.path : '';
    const outputPath = `dist/uploads/videos/${lessionId}`;
    const hlsPath = `index.m3u8`;
    console.log("video path : ", videoPath);
    const process_video:{
        status:string,
        message:string
    } = await processVideo(videoPath, outputPath, hlsPath);
    res.status(200).json(process_video);
}

export const uploadVideoHandler = async(req:Request, res:Response)=>{
    console.log("Video details : uploadVideo_cntrl, ", req.body);

    const lessionId = uuidv4();
    const videoPath:string  = req.file? req.file.path : '';
    const outputPath = `dist/uploads/videos/${lessionId}`;
    const hlsPath = `index.m3u8`;

    if(!videoPath){
        return res.status(402).json({
            message : "File could not be uploaded."
        })
    }

    console.log("VideoController : video path : ", videoPath);

    const process_video:{
        status:string,
        message:string,
        url : string
    } = await processVideo(videoPath, outputPath, hlsPath);

    console.log("VideoController: video is processed");

    const {title} = req.body;
    const newVideo = new Video(title, process_video.url);
    await newVideo.Save();
    
    console.log("VideoController: video is saved");

    res.status(200).json({
        message : "video uploaded successfully.",
        data : null
    })
}
