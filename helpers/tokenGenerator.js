const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const generateToken = (user) => {
  return jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '3d' });
};

module.exports = generateToken;
