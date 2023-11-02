const { _addOpencall, _allOpencalls, _opencallByImageId,
    _opencallByStatus, _getOpencall, _changeImageStatus,
    _artImagesByOpencall, _countArt } = require('../models/opencall.model.js');
const { S3Uploadv3 } = require('../s3Service.js');

const addOpencall = async (req, res) => {
    let opencallInfo;
    try {
        const username = req.user.username;

        if (req.file !== undefined || req.file !== null) {
            console.log("file", req.file);
            const imageUrl = await S3Uploadv3(req.file, "posters");
            opencallInfo = { ...req.body, url: imageUrl.Location };
        } else {
            opencallInfo = req.body;
        };
        const row = await _addOpencall(opencallInfo, username);
        res.json(row);
    } catch (error) {
        console.log("add opencall", error);
    };
};

const allOpencalls = async (req, res) => {
    try {
        const username = req.user.username;
        const row = await _allOpencalls(username);
        console.log("all rows of opencalls", row);
        res.json(row);
    } catch (error) {
        console.log("all opencalls", error);
    };
};

const opencallByImageId = async (req, res) => {
    try {
        const image_id = req.query.id;
        const rows = await _opencallByImageId(image_id);
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
}
const opencallByStatus = async (req, res) => {
    try {
        const username = req.user.username;
        const status = req.query.status;
        const row = await _opencallByStatus(status, username);
        res.json(row);
    } catch (error) {
        console.log("opencalls by status", error);
    };
};

const getOpencall = async (req, res) => {
    try {
        const username = req.user.username;
        const id = req.query.id;
        const row = await _getOpencall(id, username);
        res.json(row);
    } catch (error) {
        console.log(error);
    }
};

const changeImageStatus = async (req, res) => { //change status of artwork to accepted or rejected
    try {
        console.log("query=>",req.query.imageIds);
        const status = req.query.status;
        const imageIds = req.query.imageIds;
        const opencallId = req.query.opencallId;

        const data = await _changeImageStatus(status, imageIds, opencallId);
        res.json(data);
    } catch (error) {
        console.log(error);
    }
};

const artImagesByOpencall = async (req, res) => { // used in side curator
    try {
        const opencall_id = req.query.opencallId;
        const status = req.query.status;
        const row = await _artImagesByOpencall(opencall_id, status);
        res.json(row);
    } catch (error) {
        console.log(error);
    }
};

const countArt = async (req, res) => {
    const opencall_id = req.query.opencallId;
    const status = req.query.status;
    const count = await _countArt(opencall_id, status);
    res.json(count);
};

module.exports = {
    addOpencall, allOpencalls, opencallByStatus,
    opencallByImageId, getOpencall, changeImageStatus,
    artImagesByOpencall, countArt
};