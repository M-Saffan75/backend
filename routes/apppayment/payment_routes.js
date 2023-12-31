const express = require('express');
const Router = express;
const { Valid_User } = require('../../middleware/auth_middleware');
const { Payment_User, Subscription_Approve, Remove_Subscription, Decreament_Subscription  } = require('../../controllers/payment/Payment_controller')


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
// payrouter.post('/decrease/payment/subscription', Decreament_Subscription )

payrouter.post('/decrease/payment/subscription', async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        console.log('User ID not available. Function cannot be triggered.');
        return res.status(400).json({ message: 'User ID not available' });
    }
    try {
        await Decreament_Subscription(userId);
        console.log('Decrement triggered successfully');
        return res.status(200).json({ message: 'Decrement triggered successfully' });
    } catch (error) {
        console.error('Error triggering decrement:', error);
        return res.status(500).json({ message: 'Error triggering decrement', error: error.message });
    }
});



/* user Public Routes End Here */


module.exports = payrouter