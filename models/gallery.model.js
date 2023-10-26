const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allArtImages = async (username) => {
    const user_id = await userId(username);
    return db("image")
        .where({ user_id })
        .join("size", "image.size_id", "size.id")
        .select("image.id", "image.status", "image.url", "image.name", "image.creation_year", "image.price", "image.description", "size.width", "size.height")
        .orderBy("id")
        .returning(["url", "id"]);
};

const _getArtImage = async (image_id) => {
    const id = image_id.split(",");
    return db("image")
        .whereIn("image.id", id)
        .join("size", "image.size_id", "size.id")
        .select("image.id", "image.url", "image.name", "image.creation_year", "image.price", "image.description", "size.width", "size.height")
        .returning(["id", "url", "name", "creation_year", "price", "description", "width", "height"]);
};

const _addArtImage = async (username, url, artImageInfo) => {
    const user_id = await userId(username);
    const { name, price, description, creation_year, width, height } = artImageInfo;
    let size_id = await db("size")
        .select("id")
        .where({ width, height });

    if (size_id.length === 0) size_id = await db("size").insert({ width, height }).returning(["id"]);

    return db("image")
        .insert({ url, name, price, description, creation_year, size_id: size_id[0].id, user_id })
        .returning(["id"]);
};

const _addArtImageToOpencall = async (opencall_id, image_id) => {
    return db("opencall_image")
        .insert({ opencall_id, image_id });
};

const _artImagesByOpencall = async (opencall_id) => {
    try {
        let width, height, image_id;
        const sizeAndId = await db("opencall_image")
            .where("opencall_id", opencall_id)
            .join("opencall", "opencall_image.opencall_id", "opencall.id")
            .select("opencall.max_width", "opencall.max_height", "opencall_image.image_id")
            .returning(["max_width", "max_height", "image_id"]);

        width = sizeAndId[0].max_width;

        height = sizeAndId[0].max_height;

        image_id = sizeAndId.map(item => item.image_id);

        return db("image")
            .whereIn("image.id", image_id)
            .join("size", "image.size_id", "size.id")
            .select("image.id", "image.url", "image.name", "image.creation_year", "image.price", "image.description", "size.width", "size.height")
            .where("size.width", "<", width)
            .where("size.height", "<", height)
            .returning(["url", "id", "name", "creation_year", "price", "description", "width", "height"]);
    } catch (error) {
        console.error(error);
    };
};

const _deleteOpencallImage = async (opencall_id, image_id) => {
    try {
        const id = image_id.split(",");
        return db("opencall_image")
            .whereNotIn("image_id", id)
            .andWhere("opencall_id", opencall_id)
            .del()
            .returning(["image_id"]);
    } catch (error) {
        console.log(error);
    }
};

const _changeImageStatus = async (status, ids) => { 
    try {
        return db("image")
            .whereIn("id", ids)
            .update({ status: status });
    } catch (error) {
        console.log(error);
    };
};

const _updateArtInfo = async (id, artInfo) => { 
    try {
        const extractedProperties = {};
        for (const key in artInfo) {
            if (Object.hasOwnProperty.call(artInfo, key)) {
                if (key === "id" || key === "width" || key === "height") continue;
                extractedProperties[key] = artInfo[key];
            }
        };
        let size_id = await db("size")
            .select("id")
            .where({ "width": artInfo.width, "height":artInfo.height });

        if (size_id.length === 0) size_id = await db("size").insert({ "width": artInfo.width, "height": artInfo.height }).returning(["id"]);
        extractedProperties["size_id"] = size_id[0].id;
        console.log("extractedProperties", extractedProperties);

        return db("image")
            .where("id", id)
            .join("size", "image.size_id", "size.id")
            .update(extractedProperties);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { _addArtImage, _allArtImages, _getArtImage, _artImagesByOpencall, _addArtImageToOpencall, _deleteOpencallImage, _changeImageStatus, _updateArtInfo };