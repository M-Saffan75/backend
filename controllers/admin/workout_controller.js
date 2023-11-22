const multer = require('multer');
const Work = require('../../models/admin/workout.js');



/* Work Image Here Start */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Admin/workout/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const workoutImage = multer({ storage: storage });


/* Work Image Here End */



/* <><><><><>----------------------<><><><><> */


/* Create Work Api Here start*/


/* http://localhost:5000/api/Work/create_workout */



const Create_workout = async (req, res) => {

    try {
        workoutImage.single('workoutImage')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'File upload failed.', status: 'failed' });
            }
            const { name, title } = req.body;

            if (!name || !title || !req.file) {
                return res.status(402).json({ message: 'All Fields and Image Are Required', status: 'failed' });
            }

            const work = await Work({
                title,
                name,
                workoutImage: req.file.filename
            });
            await work.save();
            res.status(200).json({ message: 'Workout Create successfully', workout: work, code: 200 });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};

/* Create Team Api Here start*/

/* <><><><><>----------------------<><><><><> */



/* Create Workout Api End Here*/

/* http://localhost:5000/api/task/fetch/task */


const Get_Workout = async (req, res) => {
    try {
        const works = await Work.find();
        return res.status(200).json({ message: 'Work Retrieved Successfully', work: works, code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};


/* Create Workout Api End Here*/


/* <><><><><>----------------------<><><><><> */

// Single_Workout


/* <><><><><>----------------------<><><><><> */


/* Fetch_Single_Work Start Here*/

const Single_Workout = async (req, res) => {
    try {
        const Works = await Work.findById(req.params.id);
        if (!Works || Works.length === 0) {
            return res.status(403).json({ message: 'Work not found.', status: 'failed' });
        }

        res.status(200).json({ message: 'Work retrieved successfully', work: Works, code: 200, user: req.user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};

/* Fetch_Single_Work Start Here*/

/* <><><><><>----------------------<><><><><> */

/* <><><><><>----------------------<><><><><> */


/* Create Remove BLog start Here*/

const Remove_Workout = async (req, res) => {
    try {

        const workid = await Work.findById(req.params.id);
        console.log(workid)
        if (!workid) {
            return res.status(200).json({ message: 'work Not Found', status: 'failed' });
        }

        await Work.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Item Successfully Deleted', code: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', status: 'failed', error: error.message });
    }
};


/* Create Remove BLog End Here*/

/* <><><><><>----------------------<><><><><> */


/* <><><><><>----------------------<><><><><> */


/* update Member Profile Api start Here */


const Update_Workout = async (req, res) => {
    try {
        const { title, name } = req.body;
        if (!name || !title) {
            return res.status(400).json({ message: 'Fields are requried.', status: 'failed' });
        }
        const workout = await Work.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!workout) {
            return res.status(403).json({ message: 'Workout not found.', status: 'failed' });
        }
        res.status(200).json({ message: 'Workout updated successfully', Work: workout, code: 200 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: 'failed' });
    }
};


/* update Member Profile Api start Here */


/* <><><><><>----------------------<><><><><> */


/* <><><><><>----------------------<><><><><> */


/* update Workout Image Api start Here */


const Update_Workout_Profile = async (req, res) => {
    try {

        const workid = req.params.id;
        const workouts = await Work.findById(workid);

        if (!workouts) {
            return res.status(402).json({ message: 'Member Not Found.', status: 'failed' });
        }

        workoutImage.single('workoutImage')(req, res, async function (err) {
            if (err) {
                return res.status(403).json({ message: 'File upload failed.', status: 'failed' });
            }

            if (req.file) {
                workouts.workoutImage = req.file.filename;
                await workouts.save();

                return res.status(200).json({ message: 'Image Updated successfully.', workout: workouts, code: 200 });
            } else {
                return res.status(400).json({ message: 'No file uploaded.', status: 'failed' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'failed', message: 'Server Error' });
    }
};


/* update Workout Image Api End Here */


/* <><><><><>----------------------<><><><><> */

module.exports = {
    Create_workout, Get_Workout, Single_Workout,
    Remove_Workout, Update_Workout, Update_Workout_Profile
}