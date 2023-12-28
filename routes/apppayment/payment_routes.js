const express = require('express');
const Router = express;
const { Payment_User } = require('../../controllers/payment/Payment_controller')

const payrouter = Router()

/* user Private Routes start Here */

// router.use('/current/user', Valid_User);

/* user Private Routes End Here */


/* user Public Routes start Here */

payrouter.post('/payment/sheet', Payment_User)

/* user Public Routes End Here */


module.exports = payrouter