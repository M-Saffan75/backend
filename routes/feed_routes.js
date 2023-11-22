const express = require('express');
const Router = express;
const { Valid_User } = require('../middleware/auth_middleware');
const { create_feed_post,Approve_Single_Feed, fetch_feed,Fetch_Single_Feed, Liked_Feed, Comment_Feed, Remove_feed_post } = require('../controllers/feed_controller');


const feed_Router = Router()


/* Task Private Routes start Here */

feed_Router.use('/create/feed/post', Valid_User);
feed_Router.use('/fetch/feeds', Valid_User);
feed_Router.use('/liked/feeds/:id', Valid_User);
feed_Router.use('/comments/feeds', Valid_User);
feed_Router.use('/remove/feeds/:id', Valid_User);
feed_Router.use('/approve/single/feed/:id', Valid_User);

/* Task Private Routes End Here */


/* Task Public Routes start Here */

feed_Router.post('/create/feed/post', create_feed_post);
feed_Router.get('/fetch/feeds', fetch_feed);
feed_Router.post('/approve/single/feed/:id', Approve_Single_Feed);
feed_Router.get('/single/feed/fetch/:id', Fetch_Single_Feed);
feed_Router.post('/liked/feeds/:id', Liked_Feed);
feed_Router.post('/comments/feeds/:id', Comment_Feed);
feed_Router.post('/remove/feeds/:id', Remove_feed_post);


/* Task Public Routes End Here */


module.exports = feed_Router;