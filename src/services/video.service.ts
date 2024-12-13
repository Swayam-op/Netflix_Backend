import express, { Request, Response } from 'express';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from "fs";
import { videoType } from '../types/videoType';


// POST /process-video endpoint to upload and process video
export async function processVideo(filePath:string, outputPath:string, hlsPath:string){
    const inputVideoPath = filePath;
    const outputDir = outputPath;
    console.log("output dir : ", outputDir)
    // Create segments directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    try{
        await new Promise((resolve, reject) => {
            ffmpeg(inputVideoPath)
              .outputOptions([
                '-codec:v h264',
                '-codec:a aac',
                '-hls_time 10', // Segment duration (in seconds)
                '-hls_list_size 0', // Max number of playlist entries (0 means infinite)
                '-hls_segment_filename', `${outputDir}/segment_%03d.ts` // Segment file naming pattern
              ])
              .output(path.join(outputDir, hlsPath))
              .on('end', () => {
                resolve("Video processed");
              })
              .on('error', (err:Error) => {
                reject(err);
              })
              .run();
          });

          // remove file from uploads
          if (fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
          }
          
          return {
            url : outputDir + "/" + hlsPath,
            status : 'success',
            message : 'video processed sucessfully'
          }
    }
    catch(error:any){
      console.log("error inside fmpeg : ",error)
        return {
            url : "",
            status : 'error',
            message : error.message || 'Something went wrong'
        }
    }
}


