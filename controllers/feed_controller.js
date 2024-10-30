const Feed = require('../models/feed.js');
const User = require('../models/user.js');
const multer = require('multer');


/* challengeImage Image Here Start */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './feed/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const feedImage = multer({ storage: storage });


/* challengeImage Image Here End */


/* <><><><><>----------------------<><><><><> */


/* create create_feed_post Api Start Here*/


/* http://localhost:5000/api/feed/create/feed/post */


const create_feed_post = async (req, res) => {
    try {
        feedImage.single('feedImage')(req, res, async function (err) {
            if (err) {
                return res.status(401).json({ message: "File upload failed." });
            }
            const { description } = req.body;

            if (!description || !req.file) {
                return res.status(400).json({ message: "All Fields and Image Are Required" });
            }
            const userId = req.user._id;
            // console.log('userId>>>???', userId)

            const userFeed = await Feed({
                user_id: userId,
                description,
                feedImage: req.file.filename,
            });

            await userFeed.save();
            res.status(200).json({ message: "Feed successfully Post", code: 200, user: req.user, Feeds: userFeed });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/* create create_feed_post Api End Here*/


/* <><><><><>----------------------<><><><><> */


// /* fetch_feed Api Start Here*/


/* http://localhost:5000/api/feed/fetch/feeds */
// const challenges = await Feed.find({ approve: true });


// const fetch_feed = async (req, res) => {
//     try {
//         const feeds = await Feed.find().populate('user_id');
//         if (!feeds || feeds.length === 0) {
//             return res.status(404).json({ message: 'feeds not found.' });
//         }

//         feeds.forEach(feed => {
//             feed.likedUsers.length;
//         });

//         res.status(200).json({ message: 'feeds retrieved successfully', feed: feeds, });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     } 
// };

const fetch_feed = async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log('userId>>',req?.user?._id)
        // return
        const feeds = await Feed.find().populate('user_id');
        
        if (!feeds || feeds.length === 0) {
            return res.status(404).json({ message: 'Feeds not found.' });
        } 

        feeds.forEach(feed => {
            feed.likedUsers.length;

            // Check if the current user has liked the feed, set likeadd accordingly
            const likedByUser = feed.likedUsers.some(like => like.user_id.toString() === userId.toString());
            feed.likeadd = likedByUser;
        });

        res.status(200).json({ message: 'Feeds retrieved successfully', feed: feeds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



// /* fetch_feed Api End Here*/


// /* <><><><><>----------------------<><><><><> */


// /* User_Post_Approve Api Start Here*/
const Approve_Single_Feed = async (req, res) => {
    try {
        const feedId = req.params.id;
        const updatedFeed = await Feed.findByIdAndUpdate(
            feedId,
            { $set: { approve: true } },
            { new: true, runValidators: true }
        );

        if (!updatedFeed) {
            return res.status(404).json({ message: 'Feed not found.', status: 'failed', code: 404 });
        }

        res.status(200).json({ message: 'Feed approved successfully', feed: updatedFeed, code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};



// /* User_Post_Approve Api End Here*/


// const Liked_Feed = async (req, res) => {
//     try {
//         const { likes } = req.body;
//         const feedId = req.params.id;
//         const userId = req.user._id;

//         let feed = await Feed.findById(feedId);

//         if (!feed) {
//             return res.status(404).json({ message: 'Feed post not found.' });
//         }

//         if (feed.likedUsers.includes(userId)) {
//             return res.status(400).json({ message: 'You have already Liked this Feed.' });
//         }
//         feed.likedUsers.push(userId,likes);
//         feed.likes += 1;
//         feed.likeadd = true;

//         // Save the updated feed post
//         await feed.save();

//         res.status(200).json({ message: 'Liked the Feed successfully.', feeds: feed });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// };


// /* User_Post_Liked Api Start Here*/


// /* <><><><><>----------------------<><><><><> */


// /* User_Post_Comment Api Start Here*/


// const Liked_Feed = async (req, res) => {
//     try {
//         const feedId = req.params.id;
//         const userId = req.user._id;

//         let feed = await Feed.findById(feedId);

//         if (!feed) {
//             return res.status(404).json({ message: 'Feed post not found.' });
//         }

//         const existingLike = feed.likedUsers.find(like => like.user_id === userId);

//         if (feed.likeadd && !existingLike) {
//             // Increment the likes count inside the existingLike object
//             feed.likedUsers.push({ user_id: userId, likes: 1 });
//             feed.likes += 1;
//             feed.likeadd = true;
//             await feed.save();

//             res.status(200).json({ message: 'Liked the Feed successfully.', feeds: feed });
//         } else {
//             return res.status(400).json({ message: 'You cannot like this Feed.' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// };


const Liked_Feed = async (req, res) => {
    try {
        const feedId = req.params.id;
        const userId = req.user._id;
        let feed = await Feed.findById(feedId);

        if (!feed) {
            return res.status(404).json({ message: 'Feed post not found.', status: 'failed' });
        }

        const existingLike = await feed.likedUsers.some(likes => {
            likes.user_id.toString();
            console.log(likes.user_id, userId)
            return likes.user_id.toString() === userId.toString();
        });


        if (existingLike) {
            return res.status(400).json({ message: 'Like Already Added', status: 'failed' });
        }


        feed.likedUsers.push({ user_id: userId, likes: 1 });
        feed.likedUsers.likes += 1;
        feed.likeadd = true;
        feed.totalUsersLikes = feed.likedUsers.reduce((total, like) => total + like.likes, 0);
        await feed.save();
        res.status(200).json({ message: 'Liked the Feed successfully.', feeds: feed, code: 200 });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


/* http://localhost:5000/api/feed/post/comments */



const Comment_Feed = async (req, res) => {
    try {
        const feedId = await Feed.findById(req.params.id);
        const { comment } = req.body;
        const user_id = req.user._id;
        // return
        if (!comment) {
            return res.status(400).json({ message: 'Comment is required.', status: 'failed' });
        }
        const feedPost = await Feed.findOne(feedId);
        if (!feedPost) {
            return res.status(404).json({ message: 'Feed post not found.', status: 'failed' });
        }

        feedPost.comments.push({ user_id, comment });
        await feedPost.save();

        res.status(200).json({ message: 'Comment Added Successfully', feedPost, code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};



// /* User_Post_Comment Api End Here*/


// /* <><><><><>----------------------<><><><><> */


// /* Feed_Post_delete Api Start Here */

const Remove_feed_post = async (req, res) => {
    try {

        const feedId = await Feed.findById(req.params.id);
        const userId = req.user._id;
        // console.log(feedId)
        // console.log(userId)
        await Feed.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Feed Post Successfully Deleted', code: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// /* Feed_Post_delete Api End Here */


// Fetch single Api Start

const Fetch_Single_Feed = async (req, res) => {
    try {
        const feedId = req.params.id;
        const feed = await Feed.findById(feedId).populate('user_id');

        if (!feed) {
            return res.status(404).json({ message: 'Feed not found.', status: 'failed', code: 404 });
        }
        const userIDs = feed.comments.map(comment => comment.user_id);
        const users = await User.find({ _id: { $in: userIDs } });
        const commentsWithUserDetails = feed.comments.map(comment => {
            const userDetails = users.find(user => user._id.equals(comment.user_id));
            return {
                ...comment.toObject(),
                user: userDetails,
            };
        });

        res.status(200).json({
            message: 'Feed and comments fetched successfully',
            feed: feed.toObject(),
            comments: commentsWithUserDetails,
            code: 200,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};

module.exports = {
    create_feed_post,
    fetch_feed, Liked_Feed, Comment_Feed,
    Remove_feed_post, Fetch_Single_Feed, Approve_Single_Feed
}
