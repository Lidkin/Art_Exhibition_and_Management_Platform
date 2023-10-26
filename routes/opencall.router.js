const { addOpencall, allOpencalls, opencallByImageId, opencallByStatus, getOpencall } = require('../controllers/opencall.controller.js');
const { verifyToken } = require('../middlewares/verify.token.js');
const express = require('express');
const oRouter = express.Router();

const multer = require('multer');
const uuid = require('uuid').v4;

const storage = multer.memoryStorage({
    destination: (req, file, cb) => { cb(null, '../uploads') },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => file.mimetype.split("/")[0] === "image" ? cb(null, true) : cb(new Error("file is not a image"), false);

const upload = multer({ storage, fileFilter, limits: { fileSize: 1000000 } });

// oRouter.get('/opencall_id', getOpencall);
oRouter.get('/all', verifyToken, allOpencalls);
oRouter.patch('/add', verifyToken, upload.single("file"), addOpencall);
oRouter.get('/status', verifyToken, opencallByStatus);
oRouter.get('/byimage', opencallByImageId);
oRouter.get('/byid', getOpencall);

module.exports = { oRouter };