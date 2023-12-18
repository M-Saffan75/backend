const express = require('express');
const Router = express;
const { Valid_User } = require('../../middleware/auth_middleware');
const { Create_Subscription, Fetch_All_Subscriptions, Delete_Subscription, User_Read_Update } = require('../../controllers/admin/subscription_controller');


const subscription = Router()


/* subscription Private Routes start Here */

subscription.use('/create/subscription', Valid_User);
subscription.use('/fetch/subscription', Valid_User);
subscription.use('/subscription/delete/:id', Valid_User);
subscription.use('/update/subscription', Valid_User);

/* subscription Private Routes End Here */


/* subscription Public Routes start Here */

subscription.post('/create/subscription', Create_Subscription);
subscription.get('/fetch/subscription', Fetch_All_Subscriptions);
subscription.post('/subscription/delete/:id', Delete_Subscription);
subscription.post('/update/subscription', User_Read_Update);

/* subscription Public Routes End Here */


module.exports = subscription;