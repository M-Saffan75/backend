const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/connectdb');
const user_routes = require('./routes/user_routes');
const task_Router = require('./routes/task_routes');
const body_Router = require('./routes/body_routes');
const challenge_Router = require('./routes/challenge_route');
const feed_Router = require('./routes/feed_routes');
const team_Router = require('./routes/admin/team_routes');
const Create_Blog = require('./routes/admin/blog_routes');
const Create_Work = require('./routes/admin/workout_routes');
const Create_SubWork = require('./routes/admin/subwork_routes');
const freetask_Router = require('./routes/freetask_routes');


const app = express();
app.use(cors())
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/profiles/uploads', express.static('profiles/uploads'));
app.use('/task/uploads', express.static('task/uploads'));
app.use('/feed/uploads', express.static('feed/uploads')); 
app.use('/Challenges/uploads', express.static('Challenges/uploads'));
app.use('/Admin/teams/uploads', express.static('Admin/teams/uploads'));
app.use('/Admin/blogs/uploads', express.static('Admin/blogs/uploads'));
app.use('/Admin/workout/uploads', express.static('Admin/workout/uploads'));
app.use('/Admin/workout/videos', express.static('Admin/workout/videos'));
app.use('/freetask/uploads', express.static('freetask/uploads'));

const port = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL)

app.use('/api/user', user_routes)
app.use('/api/task', task_Router)
app.use('/api/body', body_Router)
app.use('/api/challenge', challenge_Router)
app.use('/api/feed', feed_Router)
app.use('/api/team', team_Router)
app.use('/api/blog', Create_Blog)
app.use('/api/work', Create_Work)
app.use('/api/subwork', Create_SubWork)
app.use('/api/freetask' , freetask_Router)

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
})