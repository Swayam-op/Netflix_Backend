import prisma from "../utils/db";

class Video{
    title:string
    url:string
    
    constructor(title:string, url:string){
        this.title = title
        this.url = url
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