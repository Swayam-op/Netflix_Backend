import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

// Define storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("destination directory set");
    cb(null, 'dist/uploads'); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Specify the file name
  }
});

// Define a file filter to control which files are accepted
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Accept images only
  const filetypes = /mp4|mp3|jpg|png|jpeg/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('File upload only supports the following filetypes - ' + filetypes));
  }
};

// Define multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100 // Limit file size to 100MB
  },
  fileFilter: fileFilter
});

export default upload;
