const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({

    exercise: {
        type: String,
        required: [true, 'Please add the exercise name']
    },
    reps: {
        type: String,
        required: [true, 'Please add the reps'],
    },
    set: {
        type: String,
        required: [true, 'Please add the set']
    },
    taskImage: {
        type: String,
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
