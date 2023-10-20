const { _addOpencall, _allOpencalls, _getOpencall, _opencallByStatus } = require('../models/opencall.model.js');
const { S3Uploadv3 } = require('../s3Service.js');

const addOpencall = async (req, res) => {
    let opencallInfo;
    try {
        const username = req.user.username;
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
        console.log(row);
    } catch (error) {
        console.log("all opencalls", error);
    };
};

// const getOpencall = async (req, res) => {
// try {
// const opencall_id = req.params.opencall_id;
// const row = await _getOpencall(opencall_id);
// res.json(row);
// } catch (error) {
// console.log("get opencall", error);
// };
// };

const opencallByStatus = async (req, res) => {
    try {
        const username = req.user.username;
        const { status } = req.params;
        const row = await _opencallByStatus(status, username);
        res.json(row);
    } catch (error) {
        console.log("opencalls by status", error);
    };
};

//module.exports = { addOpencall, allOpencalls, getOpencall, opencallByStatus };
module.exports = { addOpencall, allOpencalls, opencallByStatus };