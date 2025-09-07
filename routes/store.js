const express=require('express');
const store=express.Router();
const storeController=require('../controllers/storeController');

store.get('/',storeController.getIndex);
store.get('/home',storeController.getHome);
store.get('/bookings',storeController.getBookings);
store.get('/favourite',storeController.getFavourite);
store.get('/home/:homeId',storeController.getHomeDetails);
store.post("/favourite",storeController.postFavourite);
store.post("/delete-favourite/:homeId",storeController.postDeleteFavourite);



module.exports=store;

