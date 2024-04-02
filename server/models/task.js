import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    dueDate: {
        type: Date,
    },
    priority: {
        type: String,
        default: 'p1',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    recurringTask: {
        type: Boolean,
        default: false,
    },
    taskCompleted: {
        type: Date,
    },
    user_id: {
        type: String,
        required: true,
    },
    ownerEmail: {
        type: String,
    },
    reminderSent: {
        type: Boolean,
        default: false,
    },
});

const Task = new mongoose.model('Task', taskSchema);

export default Task;
