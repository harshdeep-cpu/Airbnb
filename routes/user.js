const express=require('express');
const user=express.Router();
const homesController=require('../controllers/homes');

user.get('/',homesController.getHome);


module.exports=user;

