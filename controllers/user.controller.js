const { signupService } = require('../services/user.services');

exports.signup = async (req, res, next) => {
  try {
    const user = await signupService(req.body);
    res.status(200).json({
      status: 'success',
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'User not created',
      error: error.message,
    });
  }
};