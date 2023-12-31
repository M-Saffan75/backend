const stripe = require('stripe')('sk_test_51ORxMILO9XBdvOdqPYc34ob6wRVDnIodcueGbFVplKB2b5aiDQO02pxhDvJaNuDEX9UTROpXkTZlre97wzCqKISC00MmPpf5SB')
const User = require('../../models/user.js')
const schedule = require('node-schedule');

const Payment_User = async (req, res) => {

    const { amount, currency } = req.body

    if (!amount || !currency) {
        return res.status(403).json({ message: 'fields are required.', status: 'failed', code: 403 });
    }

    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2023-10-16' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        customer: customer.id,
        payment_method_types: ['card']
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        // automatic_payment_methods: {enabled: true,},
    });

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        message: 'Payment Key has been added',
        status: 'success'
    });
};



// /* User_Post_Approve Api Start Here*/

const Subscription_Approve = async (req, res) => {
    try {

        const { payment, subscription } = req.body
        const userId = req.user.id;

        if (!payment || !subscription) {
            return res.status(403).json({ message: 'fields are required.', status: 'failed', code: 403 });
        }

        const updatesubs = await User.findByIdAndUpdate(
            userId,
            { $set: { payment: payment, subscription: subscription } },
            { new: true }
        );
        // subscription
        if (!updatesubs) {
            return res.status(404).json({ message: 'User subscription not found.', status: 'failed', code: 404 });
        }

        res.status(200).json({ message: 'subscription approved successfully', subscription: updatesubs, code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};


// delete subscription the user 

// yourController.js

const Remove_Subscription = async (req, res) => {
    try {
        const userId = req.user.id;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            { $unset: { payment: '', subscription: '' } },
            { new: true }
        );

        if (!updateUser) {
            return res.status(404).json({ message: 'User not found.', status: 'failed', code: 404 });
        }

        res.status(200).json({ message: 'Payment and subscription Has Been Expired', user: updateUser, code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};

const Decreament_Subscription = async (req, res, userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return;
        }

        while (user.subscription > 0) {
            user.subscription -= 1;
            await user.save();
            console.log('Subscription count decremented successfully');

            if (user.subscription === 0) {
                console.log('Subscription count is now 0');
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 10000)); 
        }
    } catch (error) {
        console.error('Error decrementing subscription count:', error);
    }
}


// const decrementSubscriptionCount = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const user = await User.findById(userId);

//         if (!user) {
//             console.error('User not found');
//             return;
//         }
//         if (user.subscription > 0) {
//             user.subscription -= 1;
//             await user.save();
//             console.log('Subscription count decremented successfully');
//         } else {
//             console.log('Subscription count is already 0');
//             return
//         }
//     } catch (error) {
//         console.error('Error decrementing subscription count:', error);
//     }
// };

// const job = schedule.scheduleJob('*/5 * * * * *', async (req, res) => {
//     await decrementSubscriptionCount(req, res);
//     console.log('done');
// });


// const Decreament_Subscription = async (userId) => {
//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             console.log('User not found');
//             return;
//         }

//         while (user.subscription > 0) {
//             user.subscription -= 1;
//             await user.save();
//             console.log('Subscription count decremented successfully');

//             if (user.subscription === 0) {
//                 console.log('Subscription count is now 0');
//                 return;
//             }

//             await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds before decrementing again
//         }
//     } catch (error) {
//         console.error('Error decrementing subscription count:', error);
//     }
// };

// const triggerDecrement = async (userId) => {
//     const user = await User.findById(userId);

//     if (!user) {
//         console.log('User not found');
//         return;
//     }

//     await Decreament_Subscription(userId);
// };

// const userId = req.user.id;

// if (userId) {
//     triggerDecrement(userId);
// } else {
//     console.log('User ID not available. Function cannot be triggered.');
// }

// const userId = /* '655e360b55bba0d85b630f51' */req?.user?.id;
// triggerDecrement(userId);


module.exports = { Payment_User, Subscription_Approve, Remove_Subscription, Decreament_Subscription }