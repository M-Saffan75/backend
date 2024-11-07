const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const multer = require('multer');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();



let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

/* Profile Image Here Start */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './profiles/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


/* Profile Image Here End */


/* <><><><><>----------------------<><><><><> */


/* Register Api Here start*/

/* http://localhost:5000/api/user/register */


// const Register_Here = async (req, res) => {

//     const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

//     try {
//         const { name, email, password, roletype } = req.body;
//         const errors = emailRegex.test(email);

//         if (!errors) {
//             return res.status(403).json({ message: 'Please provide a valid email address', status: 'failed', code: 403 });
//         }

//         if (!name || !email || !password || !roletype) {
//             return res.status(400).json({ message: 'All Fields and Image Are Required', code: 400 });
//         }

//         const emailExist = await User.findOne({ email });

//         if (emailExist) {
//             return res.status(402).json({ message: 'Email Already Exists', status: 'failed', });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User({
//             name,
//             email,
//             roletype: "0",
//             password: hashedPassword,
//         });

//         await user.save();
//         const token = jwt.sign({ userID: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '5d' });
//         res.status(200).json({ message: 'User registered successfully', user: user, token: token, code: 200, });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };


const generateOTP = () => Math.floor(10000 + Math.random() * 90000);

const Register_Here = async (req, res) => {

    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    try {
        const { name, email, password, roletype } = req.body;
        const errors = emailRegex.test(email);

        if (!errors) {
            return res.status(403).json({ message: "Please provide a valid email address", status: 'failed', code: 403 });
        }

        if (!name || !email || !password || !roletype) {
            return res.status(400).json({ message: "All Fields and Image Are Required", code: 400 });
        }

        const emailExist = await User.findOne({ email });

        if (emailExist) {
            return res.status(402).json({ message: "Email Already Exists", status: 'failed' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        const user = await User({
            name,
            email,
            roletype: "0",
            password: hashedPassword,
            otp,
        });

        await user.save();

        let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'OTP for Registration',
            html: `Your OTP for registration is: <strong>${otp}</strong>`,
        });

        const token = jwt.sign({ userID: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '5d' });

        res.status(200).json({
            message: "User registered successfully. Email verification OTP sent.",
            user: user,
            token: token,
            code: 200,
            info: info,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const Check_Otp = async (req, resp) => {

    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && otp) {
            if (user.otp === otp) {
                resp.status(200).send({ status: "success", message: "OTP verified successfully", code: 200, user: user, });
            } else {
                resp.status(401).send({ status: "failed", message: "Invalid OTP" });
            }
        } else {
            resp.status(403).send({ status: "failed", message: "All Fields Are Required" });
        }
    } catch (error) {
        console.log(error);
        resp.status(500).send({ status: "failed", message: "Internal Server Error" });
    }
};


/* Register Api Here End */


/* <><><><><>----------------------<><><><><> */


/* Login Api Start Here */

/* http://localhost:5000/api/user/login */


const Login_Here = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "All Fields Are Required", code: 400 });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(402).json({ status: "failed", message: "User Not Found", code: 402 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ userID: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: "5d" });
            return res.status(200).json({ status: "success", message: "Login Successfully", user: user, code: 200, token: token });
        } else {
            return res.status(401).json({ status: "failed", message: "Email or Password is Invalid", code: 401 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error", code: 500 });
    }
};


/* Login Api End Here */


/* <><><><><>----------------------<><><><><> */


/* Login Api Start Here */


/* http://localhost:5000/api/user/current/user */


const Current_User = async (req, res) => {
    try {
        const currentUser = req.user;

        if (!currentUser) {
            return res.status(404).json({ status: "failed", message: "User Not Found" });
        }
        return res.status(200).json({ status: "success", data: currentUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


/* Login Api End Here */


/* <><><><><>----------------------<><><><><> */


/* Update Api Start Here */

/* http://localhost:5000/api/user/update/user */


const Update_User_Profile = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(401).json({ status: "failed", message: "All Fields Are Required" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { name: name, email: email } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        return res.status(200).json({
            status: "success",
            code: 200,
            message: "User Profile Updated Successfully",
            user: updatedUser
        });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


/* Update Api End Here */


/* <><><><><>----------------------<><><><><> */

/* password change Api start Here */

const Password_Change = async (req, resp) => {
    try {
        const { password } = req.body;

        if (!password) {
            return resp.status(403).send({ status: "failed", "message": "All Fields Are Required" });
        }

        const newhashpassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: { password: newhashpassword } });

        if (!updatedUser) {
            return resp.status(500).send({ status: "failed", "message": "Failed to update user password" });
        }

        resp.status(200).send({ status: "Success", "message": "Password Change Successfully", code: 200 });

    } catch (error) {
        console.error('Error during password change:', error.message);
        resp.status(500).send({ "status": "failed", "message": "Internal Server Error" });
    }
};



/* password change Api End Here */

/* http://localhost:5000/api/user/update/profile */

/* Update Api End Here */


const Update_Profile = async (req, res) => {
    try {
        upload.single('profileImage')(req, res, async function (err) {
            if (err) {
                return res.status(402).json({ message: 'File upload failed.', status: 'failed', code: 402 });
            }
            if (req.file) {
                const updatedUser = await User.findByIdAndUpdate(
                    req.user._id,
                    { profileImage: req.file.filename },
                    { new: true }
                );
                return res.status(200).json({ message: 'Image uploaded successfully.', code: 200, updatedUser: updatedUser, });
            } else {
                return res.status(400).json({ message: 'No file uploaded.', status: 'failed', code: 400 });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', status: 'failed' });
    }
};


/* Update Api End Here */

/* <><><><><>----------------------<><><><><> */



/* http://localhost:5000/api/user/update/profile */

/* All User Api End Here */


const All_User = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({ message: 'Total user count fetched successfully', count: userCount, code: 200 });
    } catch (error) {
        console.error('Error during user count retrieval:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};


/* All User Api End Here */


/* <><><><><>----------------------<><><><><> */

// const Enrolled_User = async (req, res) => {
//     try {
//         const allUsers = await User.find();
//         const usersWithNonEmptySubscriptions = await User.find({ 'subscription': { $ne: null, $nin: ['', undefined] } });
//         const usersWithNonEmptyOrNullSubscriptions = await User.find({ 'subscription': { $nin: ['', undefined] } });
//         const usersWithNonNullOrUndefinedSubscriptions = await User.find({ 'subscription': { $exists: true, $ne: null } });

//         const totalAmount = allUsers.reduce((sum, user) => sum + (parseInt(user.amount) || 0), 0);

//         return res.status(200).json({
//             message: 'Users retrieved successfully',
//             usernonsubscription: usersWithNonEmptySubscriptions.length,
//             useremptysubscription: usersWithNonEmptyOrNullSubscriptions.length,
//             usersWithNonEmptySubscriptions: usersWithNonEmptySubscriptions,
//             usersWithNonEmptyOrNullSubscriptions: usersWithNonEmptyOrNullSubscriptions,
//             usersWithNonNullOrUndefinedSubscriptions: usersWithNonNullOrUndefinedSubscriptions,
//             totalAmount: totalAmount
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error', status: 'failed', code: 500 });
//     }
// };


const Enrolled_User = async (req, res) => {
    try {
        const allUsers = await User.find();
        console.log(allUsers)
        const subscribedUsers = allUsers.filter(user =>
            user.subscription !== null && user.subscription !== ''
        );

        const subscribedUsersCount = subscribedUsers.length;
        const subscribedUsersCountUser = subscribedUsers;
        const remainingUsersCount = allUsers.length - subscribedUsersCount;
        // const remainingUsersCountUser = allUsers - subscribedUsersCountUser;
        const totalAmount = allUsers.reduce((sum, user) => sum + (parseInt(user.amount) || 0), 0);

        return res.status(200).json({
            users:subscribedUsersCountUser,
            remainingUsersCountUser:allUsers,
            subscribedUsersCount:subscribedUsersCount,
            remainingUsersCount:remainingUsersCount,
            totalAmount: totalAmount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 'failed',
            code: 500,
        });
    }
};


/* 

const Enrolled_User = async (req, res) => {
try {
  const usersWithNonEmptySubscriptions = await User.find({ 'subscription': { $ne: null, $ne: undefined, $ne: '' } });
  const usersWithNonEmptyOrNullSubscriptions = await User.find({ 'subscription': { $ne: undefined, $ne: '' } });
  const usersWithNonNullOrUndefinedSubscriptions = await User.find({ 'subscription': { $exists: true, $ne: null } });

  const allUsers = [...usersWithNonEmptySubscriptions, ...usersWithNonEmptyOrNullSubscriptions, ...usersWithNonNullOrUndefinedSubscriptions];

  const totalAmount = allUsers.reduce((sum, user) => sum + (user.amount || 0), 0);

  const response = {
    message: 'Users retrieved successfully',
    usersWithNonEmptySubscriptions: usersWithNonEmptySubscriptions.length,
    usersWithNonEmptyOrNullSubscriptions: usersWithNonEmptyOrNullSubscriptions.length,
    usersWithNonNullOrUndefinedSubscriptions: usersWithNonNullOrUndefinedSubscriptions.length,
    totalCount: allUsers.length,
    totalAmount: totalAmount
  };

  return res.status(200).json(response);
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Internal Server Error', status: 'failed', code: 500 });
}
};

 
*/


// const updateExistingRecords = async () => {
//     try {
//         const result = await User.updateMany({}, { $set: { payment: null } });

//         console.log(`${result} records updated successfully.`);
//     } catch (error) {
//         console.error('Error updating records:', error);
//     }
// };

// updateExistingRecords()

module.exports = {
    Register_Here, Login_Here, Current_User, Check_Otp, Enrolled_User,
    Password_Change, Update_User_Profile, Update_Profile, All_User
}
