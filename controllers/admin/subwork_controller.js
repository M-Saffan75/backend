const multer = require('multer');
const SubWork = require('../../models/admin/subwork.js');




/* Work Image Here End */

// const VideoStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './Admin/workout/videos');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const challengeVideo = multer({
//     storage: VideoStorage,
//     fileFilter: function (req, file, cb) {
//         if (file.mimetype.startsWith('video/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only video files are allowed!'), false);
//         }
//     }
// });

// subworkImage  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Admin/subworkout/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const workoutImage = multer({ storage: storage });



/* <><><><><>----------------------<><><><><> */

// challengeVideo.single('workoutVideo')(req, res, async function (err) {

const SubWorkCreate = async (req, res) => {
    try {
        workoutImage.single('workoutVideo')(req, res, async function (err) {

            if (err) {
                console.log(err)
                return res.status(400).json({ message: 'File upload failed.', status: 'failed' });
            }

            const { title, work1, work2, work3, work4, work5, work6, benefit } = req.body;

            if (!req.file || !title || !work1 || !work2 || !work3 || !work4 || !work5 || !work6 || !benefit) {
                return res.status(402).json({ message: 'All Fields and Image are Required', status: 'failed' });
            }

            const subwork = await SubWork({
                work_id: req.params.id,
                title,
                work1,
                work2,
                work3,
                work4,
                work5,
                work6,
                benefit,
                workoutVideo: req.file.filename
            });

            await subwork.save();
            res.status(200).json({ message: 'Main Workout successfully Added', subworks: subwork, code: 200 });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
}

/* <><><><><>----------------------<><><><><> */

const Single_SubWorkout = async (req, res) => {
    try {
        const works = await SubWork.findById(req.params.id).populate('work_id');
        if (!works || works.length === 0) {
            return res.status(201).json({ message: 'SubWork Not Found', work: works, code: 201 });
        }

        return res.status(200).json({ message: 'SubWork Retrived Successfully', work: works, code: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};


/* <><><><><>----------------------<><><><><> */

// const SubWorkout_Approve = async (req, res) => {
//     try {
//         const updatedWork = await SubWork.findByIdAndUpdate(
//             req.params.id,
//             { $set: { approve: true } },
//             { new: true, runValidators: true }
//         );

//         if (!updatedWork || updatedWork.length === 0) {
//             return res.status(201).json({ message: 'SubWork Not Found', work: updatedWork, code: 201 });
//         }

//         return res.status(200).json({ message: 'SubWork Approve Successfully', work: updatedWork, code: 200 });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
//     }
// };


const SubWorkout_Approve = async (req, res) => {
    try {
        const subworkId = req.params.id;
        const userId = req.user._id;
        const subwork = await SubWork.findOne({ _id: subworkId });

        if (!subwork) {
            return res.status(403).json({ message: 'SubWork not found or unauthorized', subworkId: subworkId });
        }
        const updatedSubwork = await SubWork.findByIdAndUpdate(
            subworkId,
            { $set: { approve: true }, $push: { user_id: userId } },
            { new: true, runValidators: true }
        );

        if (!updatedSubwork) {
            return res.status(201).json({ message: 'SubWork Not Found', work: updatedSubwork, code: 201 });
        }

        return res.status(200).json({ message: 'Enrolled Successfully', work: updatedSubwork, code: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};



const All_SubWorkout = async (req, res) => {
    try {
        const works = await SubWork.find()
        if (!works || works.length === 0) {
            return res.status(201).json({ message: 'SubWork Not Found', work: works, code: 201 });
        }

        return res.status(200).json({ message: 'SubWork Retrived Successfully', work: works, code: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};



module.exports = { SubWorkCreate, Single_SubWorkout, SubWorkout_Approve, All_SubWorkout }