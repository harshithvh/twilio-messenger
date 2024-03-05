import {Router} from 'express';
import { protect } from '../middleware/auth.middlware.js';
import { createSubTask, deleteSubTask, getSubTasks, updateSubTask } from '../controller/subtask.controller.js';

const subTaskRouter = Router();


subTaskRouter
.post('/',protect,createSubTask)
.put('/:subTaskId',protect , updateSubTask)
.delete('/:subTaskId',protect,deleteSubTask)
.get('/', protect , getSubTasks)

export default subTaskRouter;