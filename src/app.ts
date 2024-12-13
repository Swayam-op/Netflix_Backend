import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';

const corsOptions = {
    origin : '*',
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials : true,
    optionsSuccessStatus: 200
}
const app:Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/dist', express.static(path.join(__dirname, '../dist')));
//routes
import userRouter from './routes/user.routes';
import videoRouter from './routes/video.routes';


app.get('/',(req, res)=>{
    res.send("hello world")
})
app.use('/public/user', userRouter);
app.use('/private/video', videoRouter);

const server = createServer(app);

export default server;


