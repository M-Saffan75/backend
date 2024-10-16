const Challenge = require('../models/challenge.js');
const multer = require('multer');



/* challengeImage Image Here Start */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './challenges/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const challengeImage = multer({ storage: storage });


/* Profile Image Here End */


/* <><><><><>----------------------<><><><><> */


/* create Create_User_Body Api Start Here*/


/* http://localhost:5000/api/challenge/create/challenge/post */


const create_Join_post = async (req, res) => {
    try {
        const userId = req.user._id;
        challengeImage.single('challengeImage')(req, res, async function (err) {
            if (err) {
                return res.status(401).json({ status: 'failed', message: "File upload failed." });
            }
            const { title, name, reps, set } = req.body;

            if (!title || !name || !reps || !set || !req.file) {
                return res.status(400).json({ status: 'failed', message: "All Fields and Image Are Required" });
            }

            console.log(userId)

            const user = await Challenge({
                user_id: userId,
                title,
                name,
                reps,
                set,
                challengeImage: req.file.filename,
            });
            await user.save();
            res.status(200).json({ message: 'Challenge successfully Post', user: req.user, code: 200 });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
    }
}

/* create Create_User_Body Api Start Here*/


/* <><><><><>----------------------<><><><><> */


/* fetch_User_Body Api Start Here*/

/* http://localhost:5000/api/challenge/create/challenge/post */


const fetch_challenge = async (req, res) => {
    try {
        const userId = req.user._id;
        const challenges = await Challenge.find().populate('user_id');

        if (!challenges || challenges.length === 0) {
            return res.status(404).json({ message: 'Challenges not found.' });
        }

        challenges.forEach(challenge => {
            // Check if the current user has joined the challenge, set JoinAdd accordingly
            const joinedByUser = challenge.joinedUsers.some(user => user.toString() === userId.toString());
            challenge.JoinAdd = joinedByUser;
        });

        res.status(200).json({ message: 'Challenges retrieved successfully', challenges: challenges });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


/* fetch_User_Body Api Start Here*/


/* <><><><><>----------------------<><><><><> */


const Single_Challenge = async (req, res) => {
    try {
        const challenges = await Challenge.findById(req.params.id).populate('user_id');
        if (!challenges|| challenges.length === 0) {
            return res.status(404).json({ message: 'Blog not found.', status: 'failed' });
        }

        res.status(200).json({ message: 'Challenge retrieved successfully', challenges: challenges, code: 200, });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
}

/* get_User_Post_Count Api Start Here*/


/* http://localhost:5000/api/challenge/join/challenge */


const JoinChallenge = async (req, res) => {
    try {
        const challengeId = req.params.id
        const userId = req.user._id;
        const challenge = await Challenge.findById(challengeId);
        // console.log(userId,req.params.id)
        // return

        let existchallenge = await Challenge.findOne({ _id: challengeId });

        if (!existchallenge) {
            existchallenge = new Challenge({
                _id: challengeId,
                joinedUsers: [userId],
            });

            await existchallenge.save();
        } else {
            if (existchallenge.joinedUsers.includes(userId)) {
                return res.status(400).json({ status: 'failed', message: 'You have already joined this challenge.', });
            }
            existchallenge.joinedUsers.push(userId);
            existchallenge.joins += 1;
            existchallenge.JoinAdd = true,
                await existchallenge.save();
        }

        res.status(200).json({ message: 'Joined the challenge successfully.', challenge: existchallenge, code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// const JoinChallenge = async (req, res) => {
//     const challengeId = req.params.id;
//     const userId = req.user._id;
//     let challenges = await Challenge.findById(challengeId);

//     if (!challenges) {
//         return res.status(404).json({ message: 'Challenge not found.', status: 'failed' });
//     }

//     const existingChallenge = await challenges.likedUsers.some(likes => {
//         likes.user_id.toString();
//         console.log(likes.user_id, userId)
//         return likes.user_id.toString() === userId.toString();
//     });


//     if (existingChallenge) {
//         return res.status(400).json({ message: 'Like Already Added', status: 'failed' });
//     }
// }


/* get_User_Post_Count Api Start Here*/


module.exports = { create_Join_post, fetch_challenge, JoinChallenge,Single_Challenge }
