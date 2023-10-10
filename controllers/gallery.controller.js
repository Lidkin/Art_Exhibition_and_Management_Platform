const { _addArtImage, _allArtImages } = require('../models/gallery.model.js');
const { S3Uploadv3 } = require('../s3Service.js');

const addArtImage = async (req, res) => {
    try {
        const username = req.user.username;
        const imageUrl = await S3Uploadv3(req.file);
        const row = await _addArtImage(username, imageUrl.Location, req.body);
        res.json(row);
    } catch (error) {
        console.log(error);
    }
};

const allArtImages = async (req, res) => { 
    try {
        const username = req.user.username;
        const row = await _allArtImages(username);
        res.json(row);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { addArtImage, allArtImages };