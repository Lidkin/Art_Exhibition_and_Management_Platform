const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allArtImages = async (username) => {
    const user_id = await userId(username);
    return db("image")
        .join("size", "image.size_id", "size.id")
        .select("image.url", "image.name", "image.creation_year", "image.price", "image.description", "size.width", "size.height")
        .where({ user_id })
        .returning(["url"]);
}

const _getArtImage = async (username) => {
    const user_id = userId(username);
    const size_id = await db("gallery")
        .select("size_id")
        .where({ user_id });
    return
}

const _addArtImage = async (username, url, artImage) => {
    const user_id = await userId(username);
    const { name, price, description, creation_year, width, height } = artImage;
    let size_id = await db("size")
        .select("id")
        .where({ width, height });

    if (size_id.length === 0) size_id = await db("size").insert({ width, height }).returning(["id"]);

    return db("image")
        .insert({ url, name, price, description, creation_year, size_id: size_id[0].id, user_id })
        .returning(["id"]);
}

const _artImagesByOpencall = (username, opencall_id) => {

}

const _sendArtImage = (username, opencall_id) => {

}

module.exports = { _addArtImage, _allArtImages };