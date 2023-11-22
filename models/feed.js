const mongoose = require('mongoose')


const feedSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        requried: true,
        ref: 'User'
    },

    description: {
        type: String,
        required: [true, 'Please add the description']
    },


    likedUsers: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likes: {
            type: Number,
            default: 0,
        },
    }],


    /*  */

    comments: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        comment: {
            type: String,
            required: true
        },
    }],

    /*  */
    
    totalUsersLikes : {
        type: String,
        default: 0
    },

    feedImage: {
        type: String,
        required: [true, 'Please add the feedImage']
    },



    likeadd: {
        type: Boolean,
        default: false
    },

    approve: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
});

const Feed = mongoose.model('Feed', feedSchema);
module.exports = Feed;
