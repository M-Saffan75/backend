const mongoose = require('mongoose')


const SubscriptionSchema = new mongoose.Schema({

    session: {
        type: String,
    },
    price: {
        type: String,
    },

}, {
    timestamps: true
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);
module.exports = Subscription;
