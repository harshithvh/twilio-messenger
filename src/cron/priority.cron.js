import Task from "../models/task.model.js";
import getNewPriority from "../utils/getPriority.util.js";

const updateTaskPriority = async (req, res) => {
  try {
    const tasks = await Task.find({
        status: { $ne: "DONE" },
        deleted_at: null
    }).select('_id due_date');

    const result = await Promise.all(tasks.map(async (task) => {
        return Task.findByIdAndUpdate(task._id, { priority: getNewPriority(task.due_date) });
    }));

    res.send(result);
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
};

export { updateTaskPriority };