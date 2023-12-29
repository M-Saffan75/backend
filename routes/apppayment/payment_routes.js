const express = require('express');
const Router = express;
const { Valid_User } = require('../../middleware/auth_middleware');
const { Payment_User, Subscription_Approve } = require('../../controllers/payment/Payment_controller')


const payrouter = Router()

/* user Private Routes start Here */

payrouter.use('/approved/payment', Valid_User);

/* user Private Routes End Here */


/* user Public Routes start Here */

payrouter.post('/payment/sheet', Payment_User)
payrouter.post('/approved/payment', Subscription_Approve)

/* user Public Routes End Here */


module.exports = payrouter