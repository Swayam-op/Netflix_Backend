import prisma from "../utils/db";

class Video{
    title:string
    url:string
    resolution:number
    constructor(title:string, url:string, resolution:number = 360){
        this.title = title
        this.url = url
        this.resolution = resolution
    }

    async Save():Promise<void>{
        const newVideo = await prisma.video.create({
            data : {
                title : this.title,
                url : this.url
            }
        });
        console.log("Video is created.")
    }
}

export default Video;