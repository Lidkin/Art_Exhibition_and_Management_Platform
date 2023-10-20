const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _allLocations = async (username) => {
    try {
        const user_id = await userId(username);
   
        return db('location').whereIn('id',
            db('users_location').select('location_id').whereIn("users_id", user_id))
            .select("name")
            .returning(["id", "name"]);
    } catch (error) {
        console.log(error);
    };
};

const _getLocationByOpencall = async (opencall_id) => {
    try {
        const location_id = await db("opencall").where({ id: opencall_id }).returning("location_id");

        return db("location")
            .where({id:location_id[0].id})
            .select("name", "address", "info", "url", "contact")
            .returning(["name", "address", "info", "url", "contact"]);
    } catch (error) {
        console.log(error);
    }
};

const _addLocation = async (location, username) => {
    const user_id = await userId(username);
    try {
        const extractedProperties = {};
        for (const key in location) {
            if (Object.hasOwnProperty.call(location, key)) {
                extractedProperties[key] = location[key];
            }
        };
        const location_id = await db("location")
            .insert({ ...extractedProperties })
            .returning(["id"]);
        return db("users_location").insert({ location_id: location_id[0].id, users_id: user_id }).returning(["id"]);

    } catch (error) {
        console.log(error);
    };
};

module.exports = { _addLocation, _allLocations, _getLocationByOpencall };