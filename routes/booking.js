const express= require('express')
const booking = express.Router();

const bookingController = require('../controllers/bookingController');

booking.post("/bookNow/:homeId",bookingController.postBookings);
booking.post("/createOrder", bookingController.createOrder);
booking.post("/verify", bookingController.verifyPayemtn)


module.exports=booking;
