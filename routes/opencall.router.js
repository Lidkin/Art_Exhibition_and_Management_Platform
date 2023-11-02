const { addOpencall, allOpencalls, opencallByImageId,
    opencallByStatus, getOpencall, changeImageStatus, artImagesByOpencall, countArt } = require('../controllers/opencall.controller.js');
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

oRouter.get('/all', verifyToken, allOpencalls);
oRouter.patch('/add', verifyToken, upload.single("file"), addOpencall);
oRouter.get('/status', verifyToken, opencallByStatus);
oRouter.get('/byimage', opencallByImageId);
oRouter.get('/byid', verifyToken, getOpencall);
oRouter.patch('/artstatus', verifyToken, changeImageStatus);  // change status of art image in table "opencall_image"  with /api/opencall/status
oRouter.get('/byopencall', verifyToken, artImagesByOpencall); // get images by opencall id with status
oRouter.get('/countart', verifyToken, countArt); //get count arts in Gallery of Opencall

module.exports = { oRouter };