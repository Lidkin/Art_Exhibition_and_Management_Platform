const { db } = require('../config/db.js');

const userId = async (username) => {
    try {
        const userid = await db("authentication")
            .select("user_id")
            .where({ username });
        return userid[0].user_id;
    } catch (error) {
        console.log(error);
    };
};

const _getUser = async (username) => {
    try {
        const id = await userId(username);
        return db("users")
            .select("firstname", "lastname", "email", "info")
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
            extractedProperties[key] = user[key];
        }
    };

    try {
        return db("users")
            .where({ id })
            .update(extractedProperties)
            .returning(["firstname", "lastname", "email", "info"]);
    } catch (error) {
        console.log(error);
    };
};

module.exports = { _getUser, _updateUser };