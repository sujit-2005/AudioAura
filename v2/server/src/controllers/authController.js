import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import signToken from '../utils/token.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (request, response, next) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError('An account with this email already exists', 409);
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user);

    response.status(201).json({
      success: true,
      token,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken(user);

    response.status(200).json({
      success: true,
      token,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (request, response) => {
  response.status(200).json({
    success: true,
    data: sanitizeUser(request.user),
  });
};

export { getMe, login, register };
