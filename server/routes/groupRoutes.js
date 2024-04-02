import express from 'express';
import { addUser, admin, deleteTask, assignTasks, updateTask, getAllUsers } from '../controllers/groupController.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './files');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    }
  });

const upload = multer({ storage: storage });
  

const groupRouter = express.Router();



groupRouter.get('/:groupName', getAllUsers);
groupRouter.post('/addUser', addUser);
groupRouter.post('/admin', admin);
groupRouter.post('/assignTasks',upload.single('file'),  assignTasks); // Use the "upload" middleware here
groupRouter.put('/', updateTask);
groupRouter.delete('/:title/:groupName', deleteTask);

export default groupRouter;
