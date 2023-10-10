const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const multer = require('multer');

require('dotenv').config();

const app = express();
const { uRouter } = require('./routes/user.router.js');
const { pRouter } = require('./routes/profile.router.js');
const { gRouter } = require('./routes/gallery.router.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "file is too large" });
        if (error.code === "LIMIT_UNEXPECTED_FILE") return res.status(400).json({ message: "file must to be an image" });}
});

app.use('/api/user', uRouter);
app.use('/api/profile', pRouter);
app.use('/api/gallery', gRouter);
// app.use('/api/opencall');

app.listen(process.env.PORT);