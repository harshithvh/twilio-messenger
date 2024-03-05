import mongoose from 'mongoose';

const enumSubTaskStatus = {
  PENDING: "PENDING",
  DONE: "DONE",
}

const subTaskSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: enumSubTaskStatus,
    default: enumSubTaskStatus.PENDING,
  },
  deleted_at:{
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now 
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  // Relationships
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
});

const SubTask = mongoose.model('SubTask', subTaskSchema);


export default SubTask;
