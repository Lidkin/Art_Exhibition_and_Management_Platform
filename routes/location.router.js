const { addLocation, allLocations, getLocationByOpencall, getLocationById } = require('../controllers/location.controller');
const { verifyToken } = require('../middlewares/verify.token.js');
const express = require('express');
const lRouter = express.Router();

lRouter.get('/byopencall', verifyToken, getLocationByOpencall);
lRouter.get('/byid', verifyToken, getLocationById);
lRouter.get('/all', verifyToken, allLocations);
lRouter.patch('/add', verifyToken, addLocation);

module.exports = { lRouter };