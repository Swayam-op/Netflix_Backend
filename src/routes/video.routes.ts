import { Router } from "express";
import { processVideoHandler,    uploadVideoHandler } from "../controller/video.controller";
import upload from '../middlewares/multer.middlewares';

const router = Router();

router.post('/process-video',upload.single('file'), processVideoHandler);
router.post('/upload-video',upload.single('file'),uploadVideoHandler);


export default router;