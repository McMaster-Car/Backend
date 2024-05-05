const User = require('../Model/User');
const bcrypt = require('bcrypt');
const userValidation = require('../Validations/userValidation')
const generateToken = require('../helpers/tokenGenerator');

const userService = {
  registerUser: async (userData) => {
    
   
    const validationResult = userValidation.validateUserRegistration(userData);

    if (validationResult.error) {
      throw new Error(validationResult.error.details[0].message);
    }
    const user = await User.findOne({email : userData.email});

    if (user) {
      throw new Error('Email Already Exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const newUser = new User(userData);
    return newUser.save();
  },
  loginUser: async (email, password) => {
    const validationResult = userValidation.validateUserLogin({ email, password });

    if (validationResult.error) {
      throw new Error(validationResult.error.details[0].message);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = generateToken(user);
    return { user, token };
  },
  viewProfile: async (userId) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error('Unable to fetch user profile');
    }
  },

  editProfile: async (userId, updatedData) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { 
          username: updatedData.username,
          address: updatedData.address,
          contact_no: updatedData.contact_no 
           } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      throw new Error('Unable to update user profile');
    }
  },

  deleteProfile: async (userId) => {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      throw new Error('Unable to delete user profile');
    }
  },
};

module.exports = userService;
