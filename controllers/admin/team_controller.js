const multer = require('multer');
const Team = require('../../models/admin/team.js');



/* team Image Here Start */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Admin/teams/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const teamImage = multer({ storage: storage });


/* team Image Here End */



/* <><><><><>----------------------<><><><><> */


/* Create Team Api Here start*/


/* http://localhost:5000/api/team/create_team */



const Create_Team = async (req, res) => {

    try {
        teamImage.single('teamImage')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: 'File upload failed.', status: 'failed' });
            }
            const { name, title, subname } = req.body;

            if (!name || !title || !subname || !req.file) {
                return res.status(400).json({ message: 'All Fields and Image Are Required', status: 'failed' });
            }

            const team = await Team({
                title,
                name,
                subname,
                teamImage: req.file.filename
            });
            await team.save();
            res.status(200).json({ message: 'Team Member Create successfully', Team: team, code: 200 });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/* Create Team Api Here start*/

/* <><><><><>----------------------<><><><><> */


/* update Team Api Here start*/

const Update_Team = async (req, res) => {
    try {
        const { title, name, subname } = req.body;
        if (!name || !title || !subname) {
            return res.status(400).json({ message: 'Fields are requried.', status: 'failed' });
        }
        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTeam) {
            return res.status(404).json({ message: 'Team not found.', status: 'failed' });
        }
        res.status(200).json({ message: 'Team updated successfully', Team: updatedTeam, code: 200 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




/* update Team Api End start*/


/* <><><><><>----------------------<><><><><> */


/* update Member Profile Api start Here */


const Update_Member_Profile = async (req, res) => {
    try {

        const memberId = req.params.id;
        const updateprofile = await Team.findById(memberId);

        if (!updateprofile) {
            return res.status(402).json({ message: 'Member Not Found.', status: 'failed' });
        }

        teamImage.single('teamImage')(req, res, async function (err) {
            if (err) {
                return res.status(403).json({ message: 'File upload failed.', status: 'failed' });
            }

            if (req.file) {
                updateprofile.teamImage = req.file.filename;
                await updateprofile.save();

                return res.status(200).json({ message: 'Image Updated successfully.', UpdatedMember: updateprofile, code: 200 });
            } else {
                return res.status(400).json({ message: 'No file uploaded.', status: 'failed' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'failed', message: 'Server Error' });
    }
};


/* update Member Profile Api start Here */


/* <><><><><>----------------------<><><><><> */

/* Fetch Member Api start Here */



const Fetch_Team = async (req, res) => {
    try {
        const teams = await Team.find();
        const user = req.user;
        // const challenges = await Feed.find({ approve: true });
        if (!teams || teams.length === 0) {
            return res.status(402).json({ message: 'Team not found.', status: 'failed', code: 402 });
        }
        // Iterate through teams and log total likes for each feed

        res.status(200).json({ message: 'Team Retrieved successfully', team: teams, code: 200 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};


/* Fetch Member Api End Here */


const Remove_Team = async (req, res) => {
    try {

        const teamId = await Team.findById(req.params.id);

        if (!teamId) {
            return res.status(200).json({ message: 'Team Not Found', status: 'failed' });
        }

        await Team.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Team Post Successfully Deleted', code: 200 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};


// Fetch single Api Start

const Fetch_Single_Team = async (req, res) => {
    try {
        const teams = await Team.findById(req.params.id);
        if (!teams) {
            return res.status(402).json({ message: 'Team not found.', status: 'failed', code: 402 });
        }
        res.status(200).json({ message: 'Team Found successfully', team: teams, code: 200 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: 'failed' });
    }
};



/* <><><><><>----------------------<><><><><> */


const Find_Team = async (req, res) => {
    try {
        const result = await Team.find({
            "$or": [
                { name: { $regex: req.params.key, $options: "i" } },
                { title: { $regex: req.params.key, $options: "i" } },
            ],
        });
        res.status(200).json({ data: result, message: 'Search successful', status: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Search failed', error, status: 'failed' });
    }
};


/* <><><><><>----------------------<><><><><> */


module.exports = {
    Create_Team, Update_Team, Update_Member_Profile,
    Fetch_Team, Remove_Team, Fetch_Single_Team, Find_Team
}
