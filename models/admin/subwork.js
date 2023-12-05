const mongoose = require('mongoose')

const subworkoutSchema = new mongoose.Schema({

    work_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Work'
    },

    // user_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default:null,
    //     ref: 'User'
    // },

    user_id: [{
        type: mongoose.Schema.Types.ObjectId,
        default:null,
        ref: 'User'
    }],

    title: {
        type: String,
    },

    work1: {
        type: String,
    },

    work2: {
        type: String,
    },

    work3: {
        type: String,
    },

    work4: {
        type: String,
    },

    work5: {
        type: String,
    },

    work6: {
        type: String,
    },

    benefit: [{
        type: String
    }],

    approve: {
        default: false,
        type: Boolean
    },

    workoutVideo: {
        type: String,
        default: null
    },

}, {
    timestamps: true
});

const SubWork = mongoose.model('SubWork', subworkoutSchema);
module.exports = SubWork;
