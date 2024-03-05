import Task from '../models/task.model.js';
import SubTask from '../models/subtask.model.js'

// Status for task model
// “TODO” - when no sub task is finished
// “IN_PROGRESS” - when at least 1 sub task is finished
// “DONE” - when every sub task is completed
const updateTaskStatus = async(task_id) => {
    const totalSubtasks = await SubTask.countDocuments({ task_id });
    const completedSubtasks = await SubTask.countDocuments({ task_id, status: 1 });
    const taskStatus = completedSubtasks === 0 ? 'TODO' : completedSubtasks === totalSubtasks ? 'DONE' : 'IN_PROGRESS';

    await Task.findByIdAndUpdate(task_id, { status: taskStatus });
}

export default updateTaskStatus;
