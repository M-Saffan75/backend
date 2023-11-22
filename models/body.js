const mongoose = require('mongoose')

const bodySchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        requried: true,
        ref: 'user'
    },
    bodytype: {
        type: String,
    },

    height: {
        type: String,
        required: [true, 'Please add the height']
    },
    steps: {
        type: String,
        required: [true, 'Please add the steps']
    },
    gender: {
        type: String,
        required: [true, 'Please add the gender']
    },
    calories: {
        type: String,
        default:null,
    },
    heartrate: {
        type: String,
        default:null,
    },
    weight: {
        type: String,
        required: [true, 'Please add the weight']
    },
    waterIntake: {
        type: String,
        required: [true, 'Please add the waterIntakes']
    },

}, {
    timestamps: true
});

const Body = mongoose.model('Body', bodySchema);
module.exports = Body;
