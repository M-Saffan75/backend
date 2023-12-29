const stripe = require('stripe')('sk_test_51ORxMILO9XBdvOdqPYc34ob6wRVDnIodcueGbFVplKB2b5aiDQO02pxhDvJaNuDEX9UTROpXkTZlre97wzCqKISC00MmPpf5SB')
const User = require('../../models/user.js')

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
        status:'success' 
    });
};



// /* User_Post_Approve Api Start Here*/

const Subscription_Approve = async (req, res) => {
    try {

        const { payment , subscription} = req.body
        const userId = req.user.id;

        if (!payment || !subscription) {
            return res.status(403).json({ message: 'fields are required.', status: 'failed', code: 403 });
        }

        const updatesubs = await User.findByIdAndUpdate(
            userId,
            { $set: { payment: payment, subscription:subscription } },
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


module.exports = { Payment_User, Subscription_Approve }