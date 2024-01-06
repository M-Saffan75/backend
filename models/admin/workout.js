const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
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
