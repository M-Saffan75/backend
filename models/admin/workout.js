const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, 'Please add the title']
    },

    name: {
        type: String,
        required: [true, 'Please add the name'],
    },

    workoutImage: {
        type: String,
    },

}, {
    timestamps: true
});

const Work = mongoose.model('Work', workoutSchema);
module.exports = Work;
