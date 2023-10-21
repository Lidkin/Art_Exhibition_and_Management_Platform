const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allArtImages = async (username) => {
    const user_id = await userId(username);
    return db("image")
        .where({ user_id })
        .join("size", "image.size_id", "size.id")
        .select("image.id", "image.url", "image.name", "image.creation_year", "image.price", "image.description", "size.width", "size.height")
        .returning(["url", "id"]);
};

// const _getArtImage = async (username, image_id) => {
    // const opencall = await db("opencall").select
    // const user_id = userId(username);
    // return db("image")
        // .join("size", "image.size_id", "size.id")
        // .select("image.url", "image.name", "image.creation_year", "image.price", "image.description", "size.width", "size.height")
        // .where({ user_id, "id": image_id })
        // .returning(["url", "name", "creation_year", "price", "description", "width", "height"]);
// };      
// 
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
    console.log("opencall_id",opencall_id);
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
            .where("size.width", "<", height)
            .returning(["url", "id", "name", "creation_year", "price", "description", "width", "height"]);
    } catch (error) { 
        console.error(error);
    };
};

// 
// module.exports = { _addArtImage, _allArtImages, _getArtImage, _artImagesByOpencall, _addArtImageToOpencall };
module.exports = { _addArtImage, _allArtImages, _artImagesByOpencall, _addArtImageToOpencall };