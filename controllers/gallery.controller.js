const { _addArtImage, _allArtImages, _getArtImage,
    _artImagesByOpencall, _addArtImageToOpencall, _deleteOpencallImage,
    _updateArtInfo, _getArtImagesIdsByOpencall, _listOpencallsForSubbmit,
    _getImageStatus} = require('../models/gallery.model.js');
const { S3Uploadv3 } = require('../s3Service.js');

const addArtImage = async (req, res) => {  // add art image and info to table "image"
    try {
        const username = req.user.username;
        const imageUrl = await S3Uploadv3(req.file, "arts");
        const row = await _addArtImage(username, imageUrl.Location, req.body);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const listOpencallsForSubbmit = async (req, res) => {  // /api/gallery/listopencalls?ids=imageIds
    try {
        const ids = req.query.ids;
        const row = await _listOpencallsForSubbmit(ids);
        console.log("list of opencalls:", row)
        const data = row.map(item => item.opencall_id);
        const opencallIds = Array.from(new Set(data));
        res.json(opencallIds);
    } catch (error) {
        console.log(error);
    }
}

const allArtImages = async (req, res) => {  // all images of user with role=artist
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

const addArtImageToOpencall = async (req, res) => {  // add image_id, opencall_id and status to table "opencall_image" with end-point /addimageopencall
    try {
        const opencall_id = req.body.opencall_id;
        const image_id = req.body.image_id;
        const status = req.query.status;
        const row = await _addArtImageToOpencall(opencall_id, image_id, status);
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

// const changeImageStatus = async (req, res) => {
    // try {
        // const { status, ids } = req.body;
        // const data = await _changeImageStatus(status, ids);
        // res.json(data);
    // } catch (error) {
        // console.log(error);
    // }
// };
 
const updateArtInfo = async (req, res) => { 
    try {
        const id = req.query.id;
        const artInfo = req.body;
        const data = await _updateArtInfo(id, artInfo);
        res.json(data);
    } catch (error) {
        console.log(error);
    }
}

const getArtImagesIdsByOpencall = async (req, res) => {
    try {
        const opencall_id = req.query.opencall_id;
        const data = await _getArtImagesIdsByOpencall(opencall_id);
        res.json(data);
    } catch (error) {
        console.log(error);
    };
};

const getImageStatus = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await _getImageStatus(id);
        res.json(data);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    addArtImage, allArtImages, getArtImage,
    artImagesByOpencall, addArtImageToOpencall, deleteOpencallImage,
    updateArtInfo, getArtImagesIdsByOpencall, listOpencallsForSubbmit,
    getImageStatus
};