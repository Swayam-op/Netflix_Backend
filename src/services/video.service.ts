import express, { Request, Response } from 'express';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from "fs";


// POST /process-video endpoint to upload and process video
export async function processVideo(filePath: string, outputPath: string, hlsPath: string) {
  const inputVideoPath = filePath;
  const outputDir = outputPath;
  console.log("output dir : ", outputDir)
  // Create segments directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
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
        .on('error', (err: Error) => {
          reject(err);
        })
        .run();
    });

    // remove file from uploads
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: outputDir + "/" + hlsPath,
      status: 'success',
      message: 'video processed sucessfully'
    }
  }
  catch (error: any) {
    console.log("error inside fmpeg : ", error)
    return {
      url: "",
      status: 'error',
      message: error.message || 'Something went wrong'
    }
  }
}


export async function processVideoWithResolution(filePath: string, outputPath: string, hlsPath: string, resolution: number) {
  const inputVideoPath = filePath;
  const outputDir = `${outputPath}/${resolution}p`;
  console.log("output dir:", outputDir);

  // Create segments directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inputVideoPath)
        .outputOptions([
          '-codec:v h264',//video codec
          '-codec:a aac', //audio codec
          `-vf scale=-2:${resolution}`, // Scale video to 360p while maintaining aspect ratio
          '-ar 48000', // Audio sampling rate
          '-crf 20', // Quality parameter for H.264 (lower is better)
          '-preset fast', // Faster encoding preset
          '-hls_time 10', // Segment duration (in seconds)
          '-hls_playlist_type vod', // Set playlist type as VOD
          '-hls_segment_filename', `${outputDir}/segment_%03d.ts` // Segment file naming pattern
        ])
        .output(path.join(outputDir, hlsPath)) // Output the 360p playlist file
        .on('end', () => {
          resolve("Video processed");
        })
        .on('error', (err: Error) => {
          reject(err);
        })
        .run();
    });

    return {
      url: outputDir + "/" + hlsPath,
      status: 'success',
      message: 'Video processed successfully'
    };
  } catch (error: any) {
    console.log("Error inside ffmpeg:", error);
    return {
      url: "",
      status: 'error',
      message: error.message || 'Something went wrong'
    };
  }
}



export async function processHLSWithMasterPlaylist(inputFilePath: string, outputDir: string) {
  console.log("processHLSWithMasterPlaylist -> Output dir for master : ", outputDir)
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Define output file paths
  const output360p = path.join(outputDir, "360p.m3u8");
  const output480p = path.join(outputDir, "480p.m3u8");
  const output180p = path.join(outputDir, "180p.m3u8");
  const masterPlaylist = path.join(outputDir, "master.m3u8");

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inputFilePath)
        .output(output360p)
        .outputOptions([
          '-codec:v h264',//video codec
          '-codec:a aac', //audio codec
          "-vf scale=-2:360",        // Scale video to 360p
          '-ar 48000',               // audio frequency
          "-b:v 800k",               // Video bitrate
          "-hls_time 10",            // Segment duration
          "-hls_playlist_type vod",  // VOD playlist
          "-var_stream_map v:0,a:0", // Define stream map
        ])
        .output(output480p)
        .outputOptions([
          '-codec:v h264',//video codec
          '-codec:a aac', //audio codec
          "-vf scale=-2:480",        // Scale video to 480p
          "-b:v 1200k",              // Video bitrate
          '-ar 48000',               // audio frequency
          "-hls_time 10",            // Segment duration
          "-hls_playlist_type vod",  // VOD playlist
          "-var_stream_map v:0,a:0", // Define stream map
        ])
        .output(output180p)
        .outputOptions([
          '-codec:v h264',//video codec
          '-codec:a aac', //audio codec
          "-vf scale=-2:180",        // Scale video to 180p
          "-b:v 400k",               // Video bitrate
          '-ar 48000',               // audio frequency
          "-hls_time 10",            // Segment duration
          "-hls_playlist_type vod",  // VOD playlist
          "-var_stream_map v:0,a:0", // Define stream map
        ])
        .output(masterPlaylist)
        .outputOptions([
          "-master_pl_name master.m3u8", // Create master playlist
        ])
        .on("end", () => {
          console.log("HLS video processing completed!");
          resolve({
            masterPlaylist,
            resolutions: {
              "360p": output360p,
              "480p": output480p,
              "180p": output180p,
            },
          });
        })
        .on("error", (err) => {
          console.error("Error processing video:", err);
          reject(err);
        })
        .run();
    });
    
    console.log("processHLSWithMasterPlaylist -> Master file is processed")

    return {
      url: outputDir + "/" + 'master.m3u8',
      status: 'success',
      message: 'Video processed successfully'
    };
  } catch (error: any) {
    console.log("Error inside ffmpeg:", error);
    return {
      url: "",
      status: 'error',
      message: error.message || 'Something went wrong'
    };
  }

}