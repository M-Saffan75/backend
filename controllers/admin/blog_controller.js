const multer = require('multer');
const Blog = require('../../models/admin/blog.js');



/* team Image Here Start */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Admin/blogs/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const blogImage = multer({ storage: storage });


/* team Image Here End */



/* <><><><><>----------------------<><><><><> */


/* Create BlogApi Here start*/


/* http://localhost:5000/api/team/create_team */



const Create_Blog = async (req, res) => {

    try {
        blogImage.single('blogImage')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'File upload failed.', status: 'failed' });
            }
            const { title, description } = req.body;

            if (!description || !title || !req.file) {
                return res.status(400).json({ message: 'All Fields and Image Are Required', status: 'failed' });
            }
            const userId = req.user._id;
            const blogs = await Blog({
                user_id:userId,
                title,
                description,
                blogImage: req.file.filename,
            });
            await blogs.save();
            res.status(200).json({ message: 'Blog Create successfully', Team: blogs, user: req.user, code: 200 });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* Create Blog Api Here start*/


/* <><><><><>----------------------<><><><><> */


/* Create Remove BLog start Here*/

const Remove_Blog = async (req, res) => {
    try {

        const blogId = await Blog.findById(req.params.id);
        console.log(blogId)
        if (!blogId) {
            return res.status(200).json({ message: 'Blog Not Found', status: 'failed' });
        }

        await Blog.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Blog  Successfully Deleted', code: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


/* Create Remove BLog End Here*/

/* <><><><><>----------------------<><><><><> */

/* Fetch BLog Start Here*/

const Fetch_Blog = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user_id');
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'blog not found.', status: 'failed' });
        }

        res.status(200).json({ message: 'Blog retrieved successfully', blog: blogs,scode: 200 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

/* Fetch BLog Start Here*/

/* <><><><><>----------------------<><><><><> */


/* Fetch_Single_Blog Start Here*/

const Fetch_Single_Blog = async (req, res) => {
    try {
        const blogs = await Blog.findById(req.params.id).populate('user_id');
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'Blog not found.', status: 'failed' });
        }

        res.status(200).json({ message: 'Blog retrieved successfully', blog: blogs, code: 200, });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};

/* Fetch_Single_Blog Start Here*/

/* <><><><><>----------------------<><><><><> */

/* Update_Blog_Image Start Here*/

const update_blog_Image = async (req, res) => {
    try {

        const blogId = req.params.id;
        const update_blog_Image = await Blog.findById(blogId);

        if (!update_blog_Image) {
            return res.status(400).json({ message: 'Blog Not Found.' });
        }

        blogImage.single('blogImage')(req, res, async function (err) {
            if (err || !req.file) {
                return res.status(400).json({ message: 'File upload failed.', status: 'failed' });
            }

            if (req.file) {
                update_blog_Image.blogImage = req.file.filename;
                await update_blog_Image.save();

                return res.status(200).json({ message: 'Image Updated successfully.', UpdatedMember: update_blog_Image, code: 200 });
            } else {
                return res.status(400).json({ message: 'No file uploaded.', status: 'failed' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Server Error' });
    }
}

/* Update_Blog_Image End Here*/


/* <><><><><>----------------------<><><><><> */


/* Update_Blog_Data Start Here*/

const Update_Blog = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required fields.' });
        }
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $set: { title: title, description: description } },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }
        res.status(200).json({ message: 'Blog post updated successfully', Blog: updatedBlog });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* Update_Blog_Data End Here*/

/* <><><><><>----------------------<><><><><> */

module.exports = {
    Create_Blog, Remove_Blog, Fetch_Blog,
    Fetch_Single_Blog, update_blog_Image, Update_Blog
}
