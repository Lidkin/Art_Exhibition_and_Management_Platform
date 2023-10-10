const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers["access-token"];
  const refreshToken = req.cookies.refreshToken || req.headers["refresh-token"];
  //const timeExpired = req.headers["time-expired"] ? true : false ;
  const secretKey = process.env.ACCESS_TOKEN_SECRET;

  // no token
  if (!refreshToken) return res.status(401).json({ msg: "not authorized" });

  // verify token
  jwt.verify(token, secretKey, (err, decode) => {
    if (err) {
      //console.log(timeExpired)
      if (!refreshToken) return res.status(403).json({ message: 'Token verification failed' });
      jwt.verify(refreshToken, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Refresh token verification failed' });
        const newToken = jwt.sign({ username: user.username }, secretKey, { expiresIn: 3600000 });
        res.cookie('token', newToken, { httpOnly: true, maxAge: 3600000 });

        req.user = user;
        next();
      });
    } else {
      req.user = decode;
      next();
    };
  });
};

module.exports = { verifyToken };
