import express from 'express';
import {createComment, getComments} from '../controllers/commentController.js';

const commentRouter=express.Router();

commentRouter.get('/', getComments)
commentRouter.post('/', createComment);

export default commentRouter;