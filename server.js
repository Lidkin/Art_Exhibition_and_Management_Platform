const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");


require('dotenv').config();

const app = express();
const { uRouter } = require('./routes/user.router.js');
const { pRouter } = require('./routes/profile.router.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/user', uRouter);
app.use('/api/profile', pRouter);
// app.use('/api/gallery');
// app.use('/api/opencall');

app.listen(process.env.PORT);