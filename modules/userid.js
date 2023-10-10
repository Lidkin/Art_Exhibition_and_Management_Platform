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

module.exports = userId;