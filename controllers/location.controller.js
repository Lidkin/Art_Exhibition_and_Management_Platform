const { _addLocation, _allLocations, _getLocationByOpencall } = require('../models/location.model.js');

const addLocation = async (req, res) => {
    try {
        const row = await _addLocation(req.body, req.user.username);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const allLocations = async (req, res) => {
    try {
        const row = await _allLocations(req.user.username);
        res.json(row);
        console.log(row)
    } catch (error) {
        console.log(error);
    };
};

const getLocationByOpencall = async (req, res) => { 
    try {
        const row = await _getLocationByOpencall(req.params.opencall_id);
        res.json(row);
    } catch (error) {
        console.log(error);   
    };
};

module.exports = {addLocation, allLocations, getLocationByOpencall};