const Subscription = require('../../models/admin/subscription.js');
const User = require('../../models/user.js');



/* <><><><><>----------------------<><><><><> */


/* Create Subscription Here start*/

const Create_Subscription = async (req, res) => {
    try {
        const { session, price } = req.body;
        if (!session || !price) {
            return res.status(400).json({ status: "failed", message: "Session and price are required fields", code: 400 });
        }
        const subscriptionCount = await Subscription.countDocuments();
        if (subscriptionCount >= 3) {
            return res.status(400).json({ status: "failed", message: "You cannot create more than 3 subscriptions", code: 400 });
        }
        const newSubscription = new Subscription({
            session: session,
            price: price,
        });
        await newSubscription.save();

        res.status(200).json({ status: "success", data: newSubscription, message: "Subscription created successfully", code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error", code: 500 });
    }
};


const Fetch_All_Subscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();

        res.status(200).json({ status: "success", subscriptions: subscriptions, code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error", code: 500 });
    }
};


const Delete_Subscription = async (req, res) => {
    try {
        const existingSubscription = await Subscription.findById(req.params.id);
        if (!existingSubscription) {
            return res.status(404).json({ status: "failed", message: "Subscription not found", code: 404 });
        }
        await Subscription.deleteOne(existingSubscription);

        res.status(200).json({ status: "success", message: "Subscription deleted successfully", code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error", code: 500 });
    }
};


const User_Read_Update = async (req, res) => {
    try {
        const userId = req.user._id; 

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { read: true } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found", code: 404 });
        }

        return res.status(200).json({ status: "success", message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "failed", message: "Internal Server Error", code: 500 });
    }
};


// const updateExistingRecords = async () => {
//     try {
//       const result = await User.updateMany({}, { $set: { read: false } });
  
//       console.log(`${result} records updated successfully.`);
//     } catch (error) {
//       console.error('Error updating records:', error);
//     }
//   };
  
//   updateExistingRecords();

module.exports = { Create_Subscription, Fetch_All_Subscriptions, Delete_Subscription, User_Read_Update }