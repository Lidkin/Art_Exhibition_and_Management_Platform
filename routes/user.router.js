const { register, login, logout } = require('../controllers/user.controller.js');
const { verifyToken } = require('../middlewares/verify.token.js');
const { userRole } = require('../middlewares/user.role.js');
const express = require('express');
const uRouter = express.Router();

uRouter.post('/register', register);

uRouter.post('/login', login);

uRouter.post('/logout', verifyToken, logout);

uRouter.get("/verify", verifyToken, (req, res) => {
    res.sendStatus(200);
});
uRouter.get("/role", verifyToken, userRole, (req, res) => { 
    res.send(req.user.role);
 });

module.exports = { uRouter };