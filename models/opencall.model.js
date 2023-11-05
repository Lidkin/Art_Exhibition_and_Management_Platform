const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allOpencalls = async (username) => {
    try {
        const user_id = await userId(username);

        return db("opencall")
            .where("user_id", user_id)
            .fullOuterJoin("location", "opencall.location_id", "location.id_location")
            .column(["opencall.id", "opencall.name", "opencall.description", "opencall.date",
                "opencall.deadline", "opencall.maxnumber", "opencall.fee", "opencall.max_width",
                "opencall.max_height", "opencall.status", "location.name as location_name",
                "location.address", "location.contact", "location.url", "location.info"])
            .select();
    } catch (error) {
        console.log("all opencalls model", error);
    };
};

const _addOpencall = async (opencall, username) => {
    try {
        const user_id = await userId(username);
        const extractedProperties = {};
        for (const key in opencall) {
            if (Object.hasOwnProperty.call(opencall, key)) {
                extractedProperties[key] = opencall[key];
            }
        };

        return db("opencall")
            .insert({ ...extractedProperties, user_id })
            .returning(["id"]);
    } catch (error) {
        console.log("add opencall model", error);
    };
};

const _opencallByStatus = async (status, username) => {
    try {
        const user_id = await userId(username);
        return db("opencall")
            .where("user_id", user_id)
            .andWhere("status", status)
            .fullOuterJoin("location", "opencall.location_id", "location.id_location")
            .column(["opencall.id",
                "opencall.name",
                "opencall.description",
                "opencall.date",
                "opencall.deadline",
                "opencall.maxnumber",
                "opencall.fee",
                "opencall.max_width",
                "opencall.max_height",
                "location.name as location_name",
                "location.address", "location.contact",
                "location.url", "location.info"])
            .select();
    } catch (error) {
        console.log("opencall by status model", error);
    };
};

const _opencallsForArtist = async (status, opencallIds) => {
    try {
        if (opencallIds.length == 0) {
            console.log("opencallIds = ''", opencallIds)
            return db("opencall")
                .where("status", status)
                .fullOuterJoin("location", "opencall.location_id", "location.id_location")
                .select([
                    "opencall.id",
                    "opencall.name",
                    "opencall.description",
                    "opencall.date",
                    "opencall.deadline",
                    "opencall.maxnumber",
                    "opencall.fee",
                    "opencall.max_width",
                    "opencall.max_height",
                    "location.name as location_name",
                    "location.address",
                    "location.contact",
                    "location.url",
                    "location.info"
                ]);
        } else {
            const ids = opencallIds.length > 1 ? opencallIds.split(',') : [opencallIds]
            console.log("ids", ids)
            return db("opencall")
                .where("status", status)
                .fullOuterJoin("location", "opencall.location_id", "location.id_location")
                .whereNotIn("id", ids)
                .select([
                    "opencall.id",
                    "opencall.name",
                    "opencall.description",
                    "opencall.date",
                    "opencall.deadline",
                    "opencall.maxnumber",
                    "opencall.fee",
                    "opencall.max_width",
                    "opencall.max_height",
                    "location.name as location_name",
                    "location.address",
                    "location.contact",
                    "location.url",
                    "location.info"
                ]);
        };
    } catch (error) {
        console.log("opencall for artist", error);
    };
};


const _opencallByImageId = async (image_id) => {
    try {
        const rows = await db("opencall_image")
            .where("image_id", image_id)
            .select("opencall_id");
        const ids = rows.map(row => row.opencall_id);
        return db("opencall")
            .whereIn("id", ids)
            .fullOuterJoin("location", "opencall.location_id", "location.id_location")
            .column(["opencall.name", "opencall.description", "opencall.date", "opencall.deadline", "opencall.maxnumber", "opencall.fee", "location.name as location_name", "location.address", "location.url"])
            .select();
    } catch (error) {
        console.log(error);
    };
};

const _getOpencall = async (id) => {
    try {
        const user_id = await userId(username);
        return db("opencall")
            .where("id", id)
            .fullOuterJoin("location", "opencall.location_id", "location.id_location")
            .column(["opencall.name", "opencall.description", "opencall.date", "opencall.deadline", "opencall.fee", "location.name as location_name", "location.address"])
            .select();
    } catch (error) {
        console.log(error);
    };
};

const _changeImageStatus = async (status, imageIds, opencall_id) => {  // axios.patch("/api/opencall/status", { status: "submitted", imageIds: selectedImageIds, opencallId: opencall_id })
    try {
        const arrIds = imageIds.length < 2 ? [...imageIds] : imageIds.split(',');
        return db("opencall_image")
            .where("opencall_id", opencall_id)
            .whereIn("image_id", arrIds)
            .update("image_status", status);
    } catch (error) {
        console.log(error);
    };
};

const _artImagesByOpencall = async (opencall_id, status) => {
    try {
        console.log("status", status);
        const arrStatus = status.includes(',') ? status.split(',') : [status];
        console.log("array of status=>", arrStatus);
        return db("opencall_image")
            .where("opencall_id", opencall_id)
            .whereIn("image_status", arrStatus)
            .leftJoin("image", "opencall_image.image_id", "image.id")
            .leftJoin("size", "image.size_id", "size.id")
            .select("image.id", "image.url", "image.name", "image.creation_year", "image.price", "image.description", "size.width", "size.height")
            .returning(["url", "id", "name", "creation_year", "price", "description", "width", "height"]);
    } catch (error) {
        console.error(error);
    };
};

const _countArt = async (opencall_id, status) => {
    try {
        const arrStatus = status.split(',');
        return db("opencall_image")
            .where("opencall_id", opencall_id)
            .whereIn("image_status", arrStatus)
            .count('* as count')
            .returning(['count']);
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    _addOpencall, _allOpencalls, _opencallByStatus,
    _opencallByImageId, _getOpencall, _changeImageStatus,
    _artImagesByOpencall, _countArt, _opencallsForArtist
};