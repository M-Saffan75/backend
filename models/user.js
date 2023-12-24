const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    roletype : {
        type :String,
        require:true,
    },
    
    name: {
        type: String,
        required: [true, 'Please add the user name']
    },
    email: {
        type: String,
        required: [true, 'Please add the user email'],
    },
    password: {
        type: String,
        required: [true, 'Please add the user password']
    },

    profileImage: {
        type: mongoose.Schema.Types.Mixed,
        default:null,
    },
    read: {
        type: Boolean,
        default:false,
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
