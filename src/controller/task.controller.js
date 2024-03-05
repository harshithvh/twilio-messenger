import Task from '../models/task.model.js';
import User from '../models/user.model.js'
import asyncHandler from 'express-async-handler';
import SubTask from '../models/subtask.model.js';
import getNewPriority from '../utils/getPriority.util.js';

const createTask = asyncHandler(async (req, res) => {
  const { title, description, due_date } = req.body;
  const user = req.user;
  const userId = user._id;

  const newTask = new Task({
    title,
    description,
    due_date,
    userId,
    priority: getNewPriority(new Date(due_date)),
  });

  try {
    const savedTask = await newTask.save();
    await User.findByIdAndUpdate(userId, { $push: { tasks: savedTask.id } });
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { due_date, status } = req.body;
  
    try {
      const updatedTask = await Task.findById(taskId);
      if (!updatedTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if (status === 'DONE') {
        const pendingSubtasks = await SubTask.find({
          task_id: taskId,
          status: 'PENDING',
          deleted_at: null,
        });

        if (pendingSubtasks.length > 0) {
          return res.status(400).json({ message: 'Cannot mark task as DONE until all subtasks are DONE' });
        }
      }

      updatedTask.due_date = due_date;
      updatedTask.status = status;
      await updatedTask.save();

      res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
  });


  const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    try {
      const task = await Task.findById(taskId);

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if(task.deleted_at) {
        res.status(400).json({ message: 'Task already deleted' });
        return;
      }

      // Soft delete the task
      task.deleted_at = new Date();
      await task.save();

      // Soft delete all associated subtasks
      const subTasks = await SubTask.find({ task_id: taskId });
      for (const subTask of subTasks) {
        subTask.deleted_at = new Date();
        await subTask.save();
      }
  
      res.status(200).json({ message: 'Task and associated subtasks deleted successfully', task });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task and associated subtasks', error: error.message });
    }
  });

  const getAllTasks = asyncHandler(async (req, res) => {
    const { priority, due_date, include_deleted, page = 1, pageSize = 10 } = req.query;
    const user = req.user;
    const userId = user._id;

    try {
      const offset = (parseInt(page) - 1) * (parseInt(pageSize));
      const filter = {
        userId,
        ...(priority && { priority: parseInt(priority) }),
        ...(due_date && { due_date: { $gte: new Date(due_date) } }),
        ...(include_deleted !== 'YES' && { deleted_at: { $eq: null } }),
      };

      const tasks = await Task.find(filter).skip(offset).limit(parseInt(pageSize));
      const totalTasks = await Task.countDocuments(filter);
      const totalPages = Math.ceil(totalTasks / (parseInt(pageSize)));

      res.send({
        tasks,
        totalTasks,
        page: page ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : DEFAULT_PAGE_SIZE,
        totalPages,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get tasks', error: error.message });
    }
  });

export 
{ 
    createTask,
    updateTask,
    deleteTask,
    getAllTasks 
};
