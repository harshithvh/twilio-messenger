// task.model.js
import mongoose from 'mongoose';

const enumTaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(v) {
        return v && v >= new Date(); // Validate that due_date is a future date
      },
      message: props => `${props.value} is not a valid due date. Due date must be a future date.`,
    },
  },
  priority: {
    type: Number,
  },
  status: {
    type: String,
    enum:enumTaskStatus,
    default: enumTaskStatus.TODO,
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
  subtasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTask', // Reference the SubTask model
  }],
  userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
  }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
