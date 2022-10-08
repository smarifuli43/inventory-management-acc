const {
  signupService,
  findUserByEmailService,
} = require('../services/user.services');
const { generateToken } = require('../utils/token');

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

/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        status: 'fail',
        error: 'Please provide email and password',
      });
    }

    const user = await findUserByEmailService(email);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        error: 'User not found. Please create an account',
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        status: 'fail',
        error: 'Incorrect password',
      });
    }
    if (user.status != 'active') {
      return res.status(403).json({
        status: 'fail',
        error: 'User is not active',
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();
    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: {
        others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'User not created',
      error: error.message,
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await findUserByEmailService(req.user?.email);
    res.status(200).json({
      status: 'success',
      message: 'User found',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'User not created',
      error: error.message,
    });
  }
};
