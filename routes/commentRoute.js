import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';

const commentRouter = express.Router();

commentRouter.post('/add', addComment);
commentRouter.get('/:lectureId', getComments);

export default commentRouter;