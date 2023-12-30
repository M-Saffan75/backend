const express = require('express');
const Router = express;
const { Valid_User } = require('../../middleware/auth_middleware');
const { Payment_User, Subscription_Approve, Remove_Subscription, decrementSubscriptionCount } = require('../../controllers/payment/Payment_controller')


const payrouter = Router()

/* user Private Routes start Here */

payrouter.use('/approved/payment', Valid_User);
payrouter.use('/remove/payment/subscription', Valid_User);
payrouter.use('/decrease/payment/subscription', Valid_User);

/* user Private Routes End Here */


/* user Public Routes start Here */

payrouter.post('/payment/sheet', Payment_User)
payrouter.post('/approved/payment', Subscription_Approve)
payrouter.post('/remove/payment/subscription', Remove_Subscription)
payrouter.post('/decrease/payment/subscription', decrementSubscriptionCount)

/* user Public Routes End Here */


module.exports = payrouter