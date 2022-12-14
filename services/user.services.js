const User = require('../models/User');

exports.signupService = async (userInfo) => {
  const user = await User.create(userInfo);
  return user;
};

exports.findUserByEmailService = async (email) => {
  const result = await User.findOne({ email: email });
  return result;
};

exports.findUserByTokenService = async (token) => {
  return await User.findOne({ confirmationToken: token });
};
