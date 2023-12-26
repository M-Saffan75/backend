const Body = require('../models/body.js');
const User = require('../models/user.js');



/* <><><><><>----------------------<><><><><> */


/* create Create_User_Body Api Start Here*/

/* http://localhost:5000/api/body/create/body */


const Create_User_Body = async (req, res) => {
    try {
        const { height, steps, gender, weight, heartrate, waterIntake, calories, bodytype } = req.body;

        if (!height || !steps || !gender || !weight || !waterIntake || !bodytype) {
            return res.status(400).json({ message: 'All Fields Are Required', status: 'failed' });
        }
        const maxHeartRate = 220 - 30;
        const userId = req.user._id;
        const body = new Body({
            user_id: userId,
            height,
            steps,
            gender,
            weight,
            heartrate: 0.7 * maxHeartRate,
            calories: steps * 0.05,
            bodytype: "1",
            waterIntake,
        });

        await body.save();
        res.status(201).json({ message: 'Body Created successfully', code: 201, body: body,/*  user: req.user */ });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};


const Update_Body = async (req, res) => {
    try {
        const { weight, heartrate, waterIntake } = req.body;
        const userId = req.user._id;

        const existingBody = await Body.findOne({ user_id: userId });

        if (!existingBody) {
            return res.status(404).json({ message: 'User body information not found', status: 'failed' });
        }

        existingBody.weight = weight;
        existingBody.heartrate = heartrate;
        existingBody.waterIntake = waterIntake;

        await existingBody.save();

        res.status(200).json({ message: 'Body Updated successfully', code: 200, body: existingBody, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};


/* create Create_User_Body Api Start Here*/


/* <><><><><>----------------------<><><><><> */


/* create Create_User_Body Api Start Here*/

/* http://localhost:5000/api/body/fetch/body/data */


const Get_User_Body = async (req, res) => {
    try {
        const userId = req.user?.id;
        const bodyData = await Body.findOne({ user_id: userId });

        if (!bodyData) {
            return res.status(403).json({ message: 'Body data not found for the user.', status: 'failed', userId: userId });
        }

        res.status(200).json({ message: 'Body data retrieved successfully', bodyData: bodyData, code: 200, });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};


/* create Create_User_Body Api Start Here*/


/* <><><><><>----------------------<><><><><> */



module.exports = { Create_User_Body, Get_User_Body, Update_Body }