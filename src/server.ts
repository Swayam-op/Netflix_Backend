import server from "./app";
import dotenv from 'dotenv';

dotenv.config()

server.listen(process.env.PORT, ()=>{
    console.log('server is listening on port : ', process.env.PORT);
})