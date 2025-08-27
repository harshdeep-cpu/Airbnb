const express=require('express');
const store=express.Router();
const storeController=require('../controllers/storeController');

store.get('/',storeController.getHome);
store.get('/bookings',storeController.getBookings);


module.exports=store;

