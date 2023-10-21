const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allOpencalls = async (username) => {
    try {
        const user_id = await userId(username);
        return db("opencall")
            .where({ user_id })
            .fullOuterJoin("location", "opencall.location_id", "location.id")
            .column(["opencall.id as id", "opencall.name", "opencall.description", "opencall.date", "opencall.deadline", "opencall.maxnumber", "opencall.fee", "opencall.max_width", "opencall.max_height", "opencall.status", "location.id as location_id"])
            .select();
    } catch (error) {
        console.log("all opencalls model", error);
    };
};

// const _getOpencall = async (id) => {
// try {
// return db("opencall")
// .where({ id: id })
// .select("name", "description", "date", "deadline", "maxnumber", "status", "fee", "max_width", "max_height")
// .returning(["location_id"]);
// 
// } catch (error) {
// console.log("get opencall model", error);
// };
// };

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
            .where({ user_id: user_id })
            .andWhere({ status: status })
            .select("id", "name", "description", "date", "deadline", "maxnumber", "fee", "max_width", "max_height");
    } catch (error) {
        console.log("opencall by status model", error);
    };
};


//module.exports = { _addOpencall, _allOpencalls, _getOpencall, _opencallByStatus };
module.exports = { _addOpencall, _allOpencalls, _opencallByStatus };