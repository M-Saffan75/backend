const express = require('express');
const router = express.Router();
const { Valid_User } = require('../middleware/auth_middleware');
const { Register_Here, All_User, Login_Here, Current_User, Check_Otp,Enrolled_User,
    Password_Change, Update_User_Profile, Update_Profile } = require('../controllers/user_controller');


/* user Private Routes start Here */

router.use('/current/user', Valid_User);
router.use('/update/user', Valid_User);
router.use('/update/profile', Valid_User);
router.use('/password/change', Valid_User);
router.use('/all/users', Valid_User);

/* user Private Routes End Here */


/* user Public Routes start Here */

router.post('/login', Login_Here);
router.get('/all/users', All_User);
router.post('/check/otp', Check_Otp);
router.post('/register', Register_Here);
router.get('/current/user', Current_User);
router.get('/enrolled/users', Enrolled_User);
router.post('/update/profile', Update_Profile);
router.post('/update/user', Update_User_Profile);
router.post('/password/change', Password_Change);


/* user Public Routes End Here */


module.exports = router;