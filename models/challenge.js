const mongoose = require('mongoose')


const challengeSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        requried: true,
        ref: 'User'
    },

    joinedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],

    title: {
        type: String,
        required: [true, 'Please add the title']
    },
    name: {
        type: String,
        required: [true, 'Please add the name']
    },
    reps: {
        type: String,
        required: [true, 'Please add the reps'],
    },
    set: {
        type: String,
        required: [true, 'Please add the set']
    },
    challengeImage: {
        type: String,
        required: [true, 'Please add the challenegeImage']
    },
    joins: {
        type: Number,
        default: 0,
    },
    JoinAdd: {
        type:Boolean,
        default: false
    },
    approve: {
        type: Boolean,
        default: false
    },


}, {
    timestamps: true
});

const Challenge = mongoose.model('Challenge', challengeSchema);
module.exports = Challenge;
