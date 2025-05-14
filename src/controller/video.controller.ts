import {processHLSWithMasterPlaylist, processVideo, processVideoWithResolution} from '../services/video.service';
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
        return res.status(400).json({
            message : "File could not be uploaded."
        })
    }

    console.log("VideoController : video path : ", videoPath);
    const {title} = req.body;
    const resolutions = [180, 240, 360]
    for(const res of resolutions){
        const process_video:{
            status:string,
            message:string,
            url : string
        } = await processVideoWithResolution(videoPath, outputPath, hlsPath, res);

        console.log(title," -> VideoController: video is processed");

        const newVideo = new Video(`${title}_${res}`, process_video.url, res);
        await newVideo.Save();

        console.log(title, " -> VideoController: video is saved with resolution : ", res);
    }
    
    //Create hls master file
    const process_video:{
        status:string,
        message:string,
        url : string
    } = await processHLSWithMasterPlaylist(videoPath, outputPath);
    
    const newVideo = new Video(`${title}_master`, process_video.url, 1080);
    await newVideo.Save();

    console.log(title, " -> VideoController: video is saved with resolution : Master");

    // Remove file from uploads
    if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
    }
  
    
    res.status(200).json({
        message : "video uploaded successfully.",
        data : null
    })
}
