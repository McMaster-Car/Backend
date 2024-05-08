const userService = require('../Services/userService');
const userValidation = require('../Validations/userValidation');



const userController = {
  registerUser: async (req, res) => {
    try {
     
      const validationResult = userValidation.validateUserRegistration(req.body);
    
      if (validationResult.error) {
        return res.status(400).json({success : false , message: validationResult.error.details[0].message });
      }
      const newUser = await userService.registerUser(req.body);
    
    
      return res.status(201).json({success : true , message: 'User registered successfully', user: newUser });
    } catch (error) {
      return res.status(500).json({ success : false , message: error.message, error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const validationResult = userValidation.validateUserLogin(req.body);

      if (validationResult.error) {
        return res.status(400).json({success : false , message: validationResult.error.details[0].message });
      }

      const { user, token } = await userService.loginUser(req.body.email, req.body.password);

     
      return res.status(200).json({ success : true , token, user: { username: user.username, email: user.email , isAdmin : user.isAdmin } });
    } catch (error) {
      return res.status(401).json({  success : false ,message: 'Invalid credentials', error: error.message });
    }
  },

  viewProfile: async (req, res) => {
    try {
     
      const userId = req.user.userId;

      
      const user = await userService.viewProfile(userId);

      return res.status(200).json({ success : true , User: user });
    } catch (error) {
      return res.status(500).json({ success : false , message: 'Internal Server Error', error: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {

      
      const users = await userService.viewUsers();


      const finalizedUsers = users.map((user)=>{

          return {
            id : user._id,
            name :  user.username,
            email : user.email,
            address : user.address,
            isAdmin : user.isAdmin,
            contact_no : user.contact_no
          }

      })

      return res.status(200).json({ success : true , Users: finalizedUsers});
    } catch (error) {
      return res.status(500).json({ success : false , message: 'Internal Server Error', error: error.message });
    }
  },

  editProfile: async (req, res) => {
    try {
      
      const userId = req.user.userId;


      
      const updatedUser = await userService.editProfile(userId, req.body);

      return res.status(200).json({ success : true , message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ success : false  , message: 'Internal Server Error', error: error.message });
    }
  },

  deleteProfile: async (req, res) => {
    try {
      
      const userId = req.user.userId;

     
      const deletedUser = await userService.deleteProfile(userId);

      return res.status(200).json({ success : true , message: 'Profile deleted successfully', user: deletedUser });
    } catch (error) {
      return res.status(500).json({ success : false , message: 'Internal Server Error', error: error.message });
    }
  },

 
};

module.exports = userController;

