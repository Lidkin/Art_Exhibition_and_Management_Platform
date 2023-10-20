const { db } = require('../config/db.js');
const userId = require('../modules/userid.js');

const userRole = async (req, res, next) => {
    const username = req.user.username;
    const id = await userId(username);
    const userRole = await db("users").where({ id: id }).select("role").returning(["role"]);
    req.user.role = userRole[0].role;
    next();
};

module.exports = { userRole };