const Task = require('../models/task.js');
const SubWork = require('../models/admin/subwork.js');
const multer = require('multer');



/* <><><><><>----------------------<><><><><> */


/* Task Image Api Start Here*/

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './task/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

/* Task Image Api Start Here*/


/* <><><><><>----------------------<><><><><> */


/* TaskCreate Api start Here*/

/* http://localhost:5000/api/task/create/task */


const Task_Create = async (req, res) => {
    try {
        const userId = req?.user?.id
        upload.single('taskImage')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'File upload failed.', error: err, status: "failed", code: 400 });
            }

            const { exercise, set, reps } = req.body;

            if (!exercise || !set || !reps || !req.file) {
                return res.status(401).json({ message: "All Fields Are Required", status: 'failed', code: 401 });
            }

            const newTask = new Task({
                exercise: exercise,
                set: set,
                reps: reps,
                subwork_id: req.params.id,
                taskImage: req.file.filename,
                user_id: userId,
            });

            await newTask.save();

            return res.status(201).json({ message: "Task Added Successfully", task: newTask, code: 200 });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", status: "failed", code: 500 });
    }
};


/* TaskCreate Api End Here*/


/* <><><><><>----------------------<><><><><> */


/* TaskGet Api End Here*/

/* http://localhost:5000/api/task/fetch/task */


const Get_Task = async (req, res) => {
    try {
        const userId = req.user.id;
        const subwork = await SubWork.findOne({ user_id: userId });

        if (!subwork) {
            return res.status(404).json({ message: 'Subwork not found' });
        }

        const tasks = await Task.find({ subwork_id: subwork._id }).populate('user_id');
        return res.status(200).json({
            message: 'Subwork with Tasks Retrieved Successfully',
            subwork: subwork,
            tasks: tasks
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



const Single_Task = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId).populate('user_id');

        if (!task) {
            return res.status(404).json({ message: 'Task not found', status: 'failed', code: 404 });
        }

        return res.status(200).json({ message: 'Task retrieved successfully', task:task, code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', status: 'failed', code: 500 });
    }
};



module.exports = { Task_Create, Get_Task, Single_Task }
