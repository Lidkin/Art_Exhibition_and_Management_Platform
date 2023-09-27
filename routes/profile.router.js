const express = require('express');
const { getUser, updateUser } = require('../controllers/profile.controller.js');
const { verifyToken } = require('../middlewares/verify.token.js');
const pRouter = express.Router();

pRouter.get('/user', verifyToken, getUser);
pRouter.patch('/update', verifyToken, updateUser);

module.exports = { pRouter };
