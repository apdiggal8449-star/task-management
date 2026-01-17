require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

const app = express();
connectDB();


app.use(cors({origin:"https://task-management-mu-ecru.vercel.app"}));
app.use(express.json());


app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/tasks', require('./routes/taskRoute'));


app.listen(port, () => console.log('Server running on 5000'));