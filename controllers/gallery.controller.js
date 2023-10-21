const { _addArtImage, _allArtImages, _getArtImage, _artImagesByOpencall, _addArtImageToOpencall, _deleteOpencallImage } = require('../models/gallery.model.js');
const { S3Uploadv3 } = require('../s3Service.js');

const addArtImage = async (req, res) => {
    try {
        const username = req.user.username;
        const imageUrl = await S3Uploadv3(req.file, "arts");
        const row = await _addArtImage(username, imageUrl.Location, req.body);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const allArtImages = async (req, res) => {
    try {
        const username = req.user.username;
        const row = await _allArtImages(username);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const getArtImage = async (req, res) => {
    try {
        const image_id = req.query.image_id;
        const row = await _getArtImage(image_id);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const artImagesByOpencall = async (req, res) => {
    try {
        const opencall_id = req.query.opencall_id;
        const row = await _artImagesByOpencall(opencall_id);
        res.json(row);
    } catch (error) {
        console.log(error);
    }
}

const addArtImageToOpencall = async (req, res) => {
    try {
        const opencall_id = req.body.opencall_id;
        const image_id = req.body.image_id;
        const row = await _addArtImageToOpencall(opencall_id, image_id);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const deleteOpencallImage = async (req, res) => {
    try {
        const opencall_id = req.query.opencall_id;
        const image_id = req.query.image_id;
        const data = await _deleteOpencallImage(opencall_id, image_id)
        res.json(data);

    } catch (error) {
        console.log(error);
    }
};

module.exports = { addArtImage, allArtImages, getArtImage, artImagesByOpencall, addArtImageToOpencall, deleteOpencallImage };