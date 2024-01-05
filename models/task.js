const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    subwork_id  : {
        type: mongoose.Schema.Types.ObjectId,
        default:null,
        ref: 'SubWork'
    },

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
