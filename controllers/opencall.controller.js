const { _addOpencall, _allOpencalls, _opencallByImageId, _opencallByStatus, _getOpencall } = require('../models/opencall.model.js');
const { S3Uploadv3 } = require('../s3Service.js');

const addOpencall = async (req, res) => {
    let opencallInfo;
    try {
        const username = req.user.username;
        console.log(req.body);
        if (req.file !== null) {
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
        const row = await _allOpencalls(req.user.username);
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
    const id = req.query.id;
    const row = await _getOpencall(id);
    res.json(row);
} catch (error) {
    console.log(error);
}
};

module.exports = { addOpencall, allOpencalls, opencallByStatus, opencallByImageId, getOpencall };