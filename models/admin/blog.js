const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        requried: true,
        ref: 'User'
    },

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    blogImage: {
        type: String,
    },

   
}, {
    timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
