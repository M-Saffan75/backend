const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, 'Please add the title']
    },

    name: {
        type: String,
        required: [true, 'Please add the name'],
    },
    subname: {
        type: String,
        required: [true, 'Please add the subname'],
    },

    teamImage: {
        type: String,
    },

}, {
    timestamps: true
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
