const User = require('../models/user')
const Home = require('../models/home');
exports.getHome = (req, res, next) => {
  Home.find().then(registerdHomes =>{
    res.render('store/home', { registerdHomes: registerdHomes, pageTitle: 'Airbnb Home',isLoggedIn: req.isLoggedIn, user: req.session.user });
  }).catch(err=>{
    console.log('Getting error while fatching',err);
  });
}

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', { pageTitle: 'My Bookings',isLoggedIn: req.isLoggedIn, user: req.session.user });
}

exports.getFavourite = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourite');
  res.render('store/favourite-list', { registerdHomes: user.favourite, pageTitle: 'My Favourites',isLoggedIn: req.isLoggedIn, user: req.session.user });
  }

exports.getIndex = (req, res, next) => {
  Home.find().then(registerdHomes =>{
    res.render('store/index', { registerdHomes: registerdHomes, pageTitle: 'Airbnb',isLoggedIn: req.isLoggedIn, user: req.session.user });
  });
}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(homes =>{
    if(!homes){
      return res.status(404).render('404', { pageTitle: 'Home Not Found',isLoggedIn: req.isLoggedIn, user: req.session.user});
    }
    else{
        res.render('store/home-details', {home:homes , pageTitle: 'home-details' , isLoggedIn: req.isLoggedIn, user: req.session.user});
    }
  })

}
  exports.postFavourite = async (req, res, next) => {
    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user =await User.findById(userId);
    if(!user.favourite.includes(homeId)){
      user.favourite.push(homeId);
      await user.save();
    }
    res.redirect('/favourite');
  }
  exports.postDeleteFavourite = async (req, res, next) => {
    const homeId = req.params.homeId;
    const userId= req.session.user._id;
    const user = await User.findById(userId);
    if(user.favourite.includes(homeId)){
      user.favourite=user.favourite.filter(fav=> fav!=homeId);
      await user.save();
    }
    res.redirect('/favourite')
}

