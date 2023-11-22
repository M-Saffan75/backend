const express = require('express');
const Router = express;
const { Valid_User } = require('../../middleware/auth_middleware');
const { Create_Blog, Remove_Blog, Fetch_Blog, Fetch_Single_Blog, update_blog_Image, Update_Blog } = require('../../controllers/admin/blog_controller');


const blog_Router = Router()

/* Blod Private Routes start Here */
blog_Router.use('/create/blog', Valid_User);
blog_Router.use('/remove/blog/:id', Valid_User);
blog_Router.use('/fetch/blog', Valid_User);
blog_Router.use('/fetch/single/blog/:id', Valid_User);
blog_Router.use('/update/blog/image/:id', Valid_User);
blog_Router.use('/update/blog/:id', Valid_User);

/* Blod Private Routes start Here */



/* Blog Public Routes start Here */

blog_Router.post('/create/blog', Create_Blog);
blog_Router.post('/remove/blog/:id', Remove_Blog);
blog_Router.get('/fetch/blog', Fetch_Blog);
blog_Router.get('/fetch/single/blog/:id', Fetch_Single_Blog);
blog_Router.post('/update/blog/image/:id', update_blog_Image);
blog_Router.post('/update/blog/:id', Update_Blog);

/* Blog Public Routes start Here */


module.exports = blog_Router;
