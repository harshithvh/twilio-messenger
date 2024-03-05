import asyncHandler from 'express-async-handler';
import updateTaskStatus from '../utils/updateTask.util.js'
import Task from '../models/task.model.js'
import SubTask from '../models/subtask.model.js';

const createSubTask = asyncHandler(async (req, res) => {
  const { task_id } = req.body;
  const user = req.user;
  const userId = user._id;

  try {
    const task = await Task.findOne({ _id: task_id, userId });
    if (!task) {
      res.status(404).send({ error: 'Task not found' });
      return;
    }

    const subtask = await SubTask.create({
      status: "PENDING", // 0 - TODO, 1 - DONE
      task_id: task._id,
    });

    await Task.findByIdAndUpdate(task._id, { $push: { subtasks: subtask._id } });
    await updateTaskStatus(task._id);
    res.status(201).json({ message: 'Subtask created successfully', subtask: subtask });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subtask', error: error.message });
  }
});


const updateSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;
    const { status } = req.body;
   // using findOneAndUpdate instead of findByIdAndUpdate because findByIdAndUpdate bypasses post('save') middleware
    try {
      const updatedSubTask = await SubTask.findOneAndUpdate(
        { _id: subTaskId },
        { $set: { status } },
        { new: true, runValidators: true }
      );


      if (!updatedSubTask) {
        res.status(404).json({ message: 'Subtask not found' });
        return;
      }
      updatedSubTask.save();
      await updateTaskStatus(updatedSubTask.task_id);
      res.status(200).json({ message: 'Subtask updated successfully', subtask: updatedSubTask });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update subtask', error: error.message });
    }
});

const deleteSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;
  
    try {
      const subTask = await SubTask.findById(subTaskId);
  
      if (!subTask) {
        return res.status(404).json({ message: 'Subtask not found' });
      }

      if (subTask.deleted_at) {
        return res.status(400).json({ message: 'Subtask is already deleted' });
      }
  
      // Soft delete the subtask
      subTask.deleted_at = new Date();
      await subTask.save({new:true});
  
      res.status(200).json({ message: 'Subtask deleted successfully', subTask });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete subtask', error: error.message });
    }
  });

  const getSubTasks = asyncHandler(async (req, res) => {
    const { task_id, include_deleted } = req.query;

    try {
      const filter = {
        ...(task_id && { task_id: task_id }),
        ...(include_deleted !== 'YES' && { deleted_at: { $eq: null } }),
      };
      const subtasks = await SubTask.find(filter);

      res.status(200).json({ subtasks });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get subtasks', error: error.message });
    }
  });


export { 
    createSubTask,
    updateSubTask,
    deleteSubTask,
    getSubTasks
};
