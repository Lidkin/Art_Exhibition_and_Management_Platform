const { addLocation, allLocations, getLocationByOpencall } = require('../controllers/location.controller');
const { verifyToken } = require('../middlewares/verify.token.js');
const express = require('express');
const lRouter = express.Router();

lRouter.get('/:opencall_id', verifyToken, getLocationByOpencall);
lRouter.get('/all', verifyToken, allLocations);
lRouter.patch('/add', verifyToken, addLocation);

module.exports = { lRouter };