const express = require('express');
const Router = express;
const { Valid_User } = require('../middleware/auth_middleware');
const { create_Join_post, Single_Challenge, fetch_challenge, JoinChallenge } = require('../controllers/challenge_controller');


const challenge_Router = Router()


/* Task Private Routes start Here */

challenge_Router.use('/create/challenge/post', Valid_User);
challenge_Router.use('/fetch/challenge', Valid_User);
challenge_Router.use('/join/challenge/:id', Valid_User);

/* Task Private Routes End Here */


/* Task Public Routes start Here */

challenge_Router.post('/create/challenge/post', create_Join_post);
challenge_Router.get('/fetch/challenge', fetch_challenge);
challenge_Router.post('/join/challenge/:id', JoinChallenge);
challenge_Router.get('/single/challenge/:id', Single_Challenge);

/* Task Public Routes End Here */


module.exports = challenge_Router;