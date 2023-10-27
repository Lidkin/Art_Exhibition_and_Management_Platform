const { json } = require('express');
const { _addLocation, _allLocations, _getLocationByOpencall, _getLocationById } = require('../models/location.model.js');

const addLocation = async (req, res) => {
    try {
        const username = req.user.username;
        const body = req.body;
        const row = await _addLocation(body, username);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const getLocationById = async (req, res) => {
    try {
        const username = req.user.username;
        const id = req.query.id;
        const row = await _getLocationById(id, username);
        res.json(row);
    } catch (error) {
        console.log(error);
    };
};

const allLocations = async (req, res) => {
    try {
        const username = req.user.username;
        const row = await _allLocations(username);
        res.json(row);
        console.log(row)
    } catch (error) {
        console.log(error);
    };
};

const getLocationByOpencall = async (req, res) => { 
    try {
        const username = req.user.username;
        const opencall_id = req.query.opencall_id;
        const row = await _getLocationByOpencall(opencall_id, username);
        res.json(row);
    } catch (error) {
        console.log(error);   
    };
};

module.exports = {addLocation, allLocations, getLocationByOpencall, getLocationById};