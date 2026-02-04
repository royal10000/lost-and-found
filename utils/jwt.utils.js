const jwt = require("jsonwebtoken");
exports.signToken =  (res, payload={}) => {
  const lost_cookie =  jwt.sign(payload, process.env.JWTSECRET, {
    expiresIn: "1d",
  });
  res.cookie("access_token", lost_cookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

exports.verifyToken =  (token) => {
  return  jwt.verify(token, process.env.JWTSECRET);
};
