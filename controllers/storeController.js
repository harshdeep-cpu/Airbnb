const Home = require('../models/home');

exports.getHome=(req,res,next) => {
  Home.fetchAll((registerdHomes) => {
    res.render('store/home',{registerdHomes:registerdHomes , pageTitle:'Airbnb Home'});
  });
  
}

exports.getBookings=(req,res,next) => {
    console.log(req.url)
    res.render('store/bookings',{ pageTitle:'My Bookings'});
  
}