const UserRouter = require("express").Router();
const userController= require('../../Controllers/userController');
const verifyToken = require('../../Middlewares/tokenVerification');

UserRouter.post('/register', 
    userController.registerUser);

UserRouter.post('/login',
    userController.loginUser)

UserRouter.get('/view-profile', 
    verifyToken, 
    userController.viewProfile);

UserRouter.put('/edit-profile', 
    verifyToken, 
    userController.editProfile);
    

UserRouter.delete('/delete-profile', 
    verifyToken, 
    userController.deleteProfile);
  

module.exports = UserRouter;