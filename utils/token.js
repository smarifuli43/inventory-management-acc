const jwt = require('jsonwebtoken');

exports.generateToken = (userInfo) => {
  // store some user info in the token payload
  const payload = {
    email: userInfo.email,
    role: userInfo.role,
  };
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '7day', // token expires in 7 days
  });
  return token;
};
