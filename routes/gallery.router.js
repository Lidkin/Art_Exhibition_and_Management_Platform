const { addArtImage, allArtImages, getArtImage, artImagesByOpencall, addArtImageToOpencall, deleteOpencallImage } = require('../controllers/gallery.controller.js');
const { verifyToken } = require('../middlewares/verify.token.js');
const express = require('express');
const gRouter = express.Router();

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

const upload = multer({ storage, fileFilter, limits: { fileSize: 2000000 } });

gRouter.post('/addimage', verifyToken, upload.single("file"), addArtImage);
gRouter.post('/imageopencall', verifyToken, addArtImageToOpencall);
gRouter.get('/getimages', verifyToken, allArtImages);
gRouter.get('/byid', verifyToken, getArtImage);
gRouter.get('/byopencall', verifyToken, artImagesByOpencall);
gRouter.delete('/reject', verifyToken, deleteOpencallImage);


module.exports = { gRouter };
