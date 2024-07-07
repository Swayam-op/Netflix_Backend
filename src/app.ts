import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';


const corsOptions = {
    origin : '*',
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials : true,
    optionsSuccessStatus: 200
}
const app:Application = express();

app.use(cors(corsOptions));
app.use(express.json());

//routes
import userRouter from './routes/user.routes';

app.get('/',(req, res)=>{
    res.send("hello world")
})
app.use('/public/user', userRouter);


const server = createServer(app);

export default server;


