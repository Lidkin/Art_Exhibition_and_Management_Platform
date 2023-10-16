const { addOpencall, allOpencalls, getOpencall } = require('../controllers/opencall.controller.js');
const { verifyToken } = require('../middlewares/verify.token.js');
const express = require('express');
const oRouter = express.Router();

oRouter.get('/:opencall_id', getOpencall);
oRouter.get('/all', verifyToken, allOpencalls);
oRouter.patch('/add', verifyToken, addOpencall);

module.exports = { oRouter };