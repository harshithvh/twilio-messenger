import {Router} from 'express';
import {createTask, deleteTask, getAllTasks, updateTask} from '../controller/task.controller.js';
import { protect } from '../middleware/auth.middlware.js';

const taskRouter = Router();


taskRouter
.post('/',protect,createTask)
.put('/:taskId',protect,updateTask)
.delete('/:taskId',protect,deleteTask)
.get('/',protect,getAllTasks)


export default taskRouter;