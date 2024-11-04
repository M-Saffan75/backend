const FreeTask = require('../models/freetask.js');
const multer = require('multer');



/* <><><><><>----------------------<><><><><> */


/* Task Image Api Start Here*/

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './freetask/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

/* Task Image Api Start Here*/


/* <><><><><>----------------------<><><><><> */


/* TaskGet Api End Here*/


/* <><><><><>----------------------<><><><><> */


const Demo_Task_Create = async (req, res) => {
    try {
        upload.single('taskImage')(req, res, async function (err) {
            if (err) {
                return res.status(401).json({ message: "File upload failed.", error: err, status: "failed" });
            }

            const { exercise, set, reps } = req.body;

            if (!exercise || !set || !reps || !req.file) {
                return res.status(400).json({ message: "All Fields Are Required", status: 'failed' });
            }

            const newTask = new FreeTask({
                exercise: exercise,
                set: set,
                reps: reps,
                taskImage: req.file.filename,
            });

            await newTask.save();

            return res.status(201).json({ message: "DemoTask Added Successfully", task: newTask, code: 200 });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const Demo_Get_Task = async (req, res) => {
    try {
        const tasks = await FreeTask.find();
        return res.status(200).json({ message: 'Tasks Retrieved Successfully', tasks: tasks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { Demo_Task_Create, Demo_Get_Task }
