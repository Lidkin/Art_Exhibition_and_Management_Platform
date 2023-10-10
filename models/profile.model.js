const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const _getUser = async (username) => {
    try {
        const id = await userId(username);
        return db("users")
            .select("firstname", "lastname", "email", "info", "role")
            .where({ id });
    } catch (error) {
        console.log(error);
    };
};

const _updateUser = async (user, username) => {
    const extractedProperties = {};
    const id = await userId(username);

    for (const key in user) {
        if (Object.hasOwnProperty.call(user, key)) {
            if (key === "username") continue;
            extractedProperties[key] = user[key];
        }
    };

    try {
        return db("users")
            .where({ id })
            .update(extractedProperties)
            .returning(["firstname", "lastname", "email", "info", "role"]);
    } catch (error) {
        console.log(error);
    };
};

module.exports = { _getUser, _updateUser };