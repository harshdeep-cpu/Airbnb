
const Home = require('../models/home');
const User = require('../models/user');
const Booking = require("../models/booking");
const razorpayInstance= require("../razorpay.config.js");
const crypto  = require("crypto")

const booking = require('../routes/booking');
exports.postBookings =  (req,res,next) =>{
  const homeId = req.params.homeId;
  Home.findById(homeId).then(async (homes) => {
    if(!homes){
      const userId = req.session.user._id;
      const user = await User.findById(userId).populate('bookings');
        res.render('store/bookings', { registerdHomes: user.booking, pageTitle: 'My Bookings',isLoggedIn: req.isLoggedIn, user: req.session.user, active: "bookings" });
    }
    res.render('bookings/bookNow', {
      homeId: homeId,
      home:homes,
      pageTitle: 'Bookings',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      active: ""
    })
  })
}
exports.createOrder = (req,res,next) =>{
  const {homeId}=req.body;
  Home.findById(homeId).then(homes => {
    if (!homes) {
  return res.status(404).json({
    success: false,
    message: "Home not found"
  });
  }

    else{
      const amount=homes.price;
      const options = {
        amount: amount,
        currency: "INR",
        receipt: 'receipt_order_1',
      }
      try{
        razorpayInstance.orders.create(options, (err,order) =>{
          if(err){
            return res.status(500).json({
              sucess: false,
              message: "Something went wrong",
            })
          }
          return res.status(200).json(order)
        })
      } catch(error){
        return res.status(500).json({
          sucess: false,
          message: "Something went wrong",
        });
      }
    }
  })
}

exports.verifyPayemtn = async (req,res,next) => {
  const {order_id, payment_id, signature} = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const hmac = crypto.createHmac('sha256' , secret);
  hmac.update(order_id + "|" + payment_id);

  const genrateSignature = hmac.digest('hex');

  if(genrateSignature=== signature){
    return res.status(200).json({
      sucess: true,
      message: "Payment Verfied",
    })
  }else{
    return res.status(400).json({
      sucess: false,
      message: "Payment not verified",
    })
  }
}