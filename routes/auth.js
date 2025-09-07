const express= require('express');
const auth = express.Router();

const authController = require('../controllers/authController');

auth.get("/login",authController.getLogin);
auth.post("/login",authController.postLogin);
auth.post("/logout",authController.postLogout);
auth.get("/signup", authController.getSignUp);
auth.post("/signup",authController.postSignUp);

module.exports=auth;