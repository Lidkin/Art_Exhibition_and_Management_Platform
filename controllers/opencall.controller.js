const { _addOpencall, _allOpencalls, _getOpencall } = require('../models/opencall.model.js');

const addOpencall = async (req, res) => {
    try {
        const row = await _addOpencall(req.body, req.user.username);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const allOpencalls = async (req, res) => {
    try {
        const row = await _allOpencalls(req.user.username);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const getOpencall = async (req, res) => {
    try {
        const row = await _getOpencall(req.params.opencall_id);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

module.exports = { addOpencall, allOpencalls, getOpencall };