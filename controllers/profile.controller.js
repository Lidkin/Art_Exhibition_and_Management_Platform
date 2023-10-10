const { _getUser, _updateUser} = require('../models/profile.model.js')
require('dotenv').config();

const getUser = async (req, res) => {
    try {
        const name = req.user.username;
        const row = await _getUser(name);
        res.json(row);
    } catch (error) {
        console.log(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const user = req.body;
        const name = req.user.username;
        const row = await _updateUser(user, name);
        res.json(row);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { getUser, updateUser };