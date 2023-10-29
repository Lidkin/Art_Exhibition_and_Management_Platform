const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allOpencalls = async (username) => {
    try {
        const user_id = await userId(username);
        
        return db("opencall")
            .where("user_id", user_id)
            .fullOuterJoin("location", "opencall.location_id", "location.id_location")
            .column(["opencall.id", "opencall.name", "opencall.description", "opencall.date", "opencall.deadline", "opencall.maxnumber", "opencall.fee", "opencall.max_width", "opencall.max_height", "opencall.status", "location.name as location_name", "location.address", "location.contact", "location.url", "location.info"])
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
            .column(["opencall.id", "opencall.name", "opencall.description", "opencall.date", "opencall.deadline", "opencall.maxnumber", "opencall.fee", "opencall.max_width", "opencall.max_height", "location.name as location_name", "location.address", "location.contact", "location.url", "location.info"])
            .select();
    } catch (error) {
        console.log("opencall by status model", error);
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
            .andWhere("user_id", user_id)
            .fullOuterJoin("location", "opencall.location_id", "location.id_location")
            .column(["opencall.name", "opencall.description", "opencall.date", "opencall.deadline", "opencall.maxnumber", "opencall.fee", "location.name as location_name", "location.address", "location.contact", "location.url", "location.info"])
            .select();
    } catch (error) {
        console.log(error);
    };
};

module.exports = { _addOpencall, _allOpencalls, _opencallByStatus, _opencallByImageId, _getOpencall };