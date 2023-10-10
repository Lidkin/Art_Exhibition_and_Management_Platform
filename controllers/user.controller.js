const { _register, _login } = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { firstname, lastname, email, role, info, username, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password + "", salt);
        const row = await _register(firstname, lastname, email, role, info, username.toLowerCase(), hash);
        res.json(row);
    } catch (err) {
        if (err.message.includes('null value in column "id"')) {
            console.error(`Invalid role: ${role}`);
        } else {
            console.log(err);
            res.status(404).json({ msg: 'username already exist' });
        }
    }
}

const login = async (req, res) => { 
    try {
        const row = await _login(req.body.username.toLowerCase());
        if (row.length === 0) return res.status(404).json({ msg: "username not found" });

        const match = await bcrypt.compare(req.body.password + "", row[0].password);
        if (!match) return res.status(404).json({ msg: "wrong password" });

        const username = row[0].username;
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const accessToken = jwt.sign({ username }, secret, { expiresIn: 3600000 });
        const refreshToken = jwt.sign({ username }, secret, { expiresIn: 86400000 });
        
        res.cookie("token", accessToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour in seconds
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 86400000 }); //24 hours in seconds

        res.status(200).json({ token: accessToken, refreshToken: refreshToken});
    } catch (err) {
        console.log(err)
    }
}

const logout = (req, res) => {
    req.user = null;
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = { register, login, logout };