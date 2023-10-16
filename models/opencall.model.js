const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allOpencalls = async (username) => {
    
    try {
        const user_id = await userId(username);
        return db("opencall")
            .where({ user_id: user_id })
            .select("*")

    } catch (error) {
        console.log(error);
    };
};

const _getOpencall = async (id) => {

    return db("opencall")
        .where({ id: id })
        .select("name", "description", "date", "deadline", "maxnumber", "status", "fee", "max_width", "max_height")
        .returning(["location_id"]);
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
        console.log(error);
    };
};

module.exports = { _addOpencall, _allOpencalls, _getOpencall };