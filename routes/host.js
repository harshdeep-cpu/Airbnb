const express=require('express');
const host=express.Router();
const homesController = require('../controllers/homes');

host.use(express.urlencoded());


host.get('/addHome',homesController.getAddHome);

host.post('/addHome',homesController.postAddHome);

exports.host=host;
