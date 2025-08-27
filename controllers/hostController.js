
const Home = require('../models/home');

exports.getAddHome=(req,res,next) => {
  res.render('host/addHome',{pageTitle:'Add Home'});
}

exports.postAddHome=(req,res,next) => {
  const {houseName, price, location,rating, photoUrl} = req.body;
  const home = new Home(houseName, price, location,rating, photoUrl);
  home.save();
  res.render('host/submitedHome',{ pageTitle:'Home Submited'});
}


