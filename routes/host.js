const express=require('express');
const host=express.Router();
const hostController = require('../controllers/hostController');

host.use(express.urlencoded());


host.get('/addHome',hostController.getAddHome);

host.post('/addHome',hostController.postAddHome);
host.get('/host-home-list',hostController.getHostHome);
host.get('/edit-home/:homeId',hostController.getEditHome);
host.post('/edit-home',hostController.postEditHome);
host.post('/delete-home/:homeId',hostController.postDeleteHome);

module.exports=host;
