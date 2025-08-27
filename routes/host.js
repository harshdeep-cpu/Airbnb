const express=require('express');
const host=express.Router();
const hostController = require('../controllers/hostController');

host.use(express.urlencoded());


host.get('/addHome',hostController.getAddHome);

host.post('/addHome',hostController.postAddHome);

module.exports=host;
