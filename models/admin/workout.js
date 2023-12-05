const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    
    title: {
        type: String,
    },

    name: {
        type: String,
    },

    workoutImage: {
        type: String,
    },

}, {
    timestamps: true
});

const Work = mongoose.model('Work', workoutSchema);
module.exports = Work;
