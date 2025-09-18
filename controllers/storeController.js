const User = require('../models/user')
const Home = require('../models/home');
exports.getHome = (req, res, next) => {
  Home.find().then(registerdHomes =>{
    res.render('store/home', { registerdHomes: registerdHomes, pageTitle: 'Airbnb Home',isLoggedIn: req.isLoggedIn, user: req.session.user, active:"home" });
  }).catch(err=>{
    console.log('Getting error while fatching',err);
  });
}

exports.getBookings = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate({
    path: 'bookings',
    populate: { path: 'home' } // 👈 so each booking also shows Home details
  });

  res.render('store/bookings', {
    bookings: user.bookings,
    pageTitle: 'My Bookings',
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
    active: "bookings"
  });
};


exports.getFavourite = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourite');
  res.render('store/favourite-list', { registerdHomes: user.favourite, pageTitle: 'My Favourites',isLoggedIn: req.isLoggedIn, user: req.session.user, active: "favourite" });
  }

exports.getIndex = (req, res, next) => {
  Home.find().then(registerdHomes =>{
    res.render('store/index', { registerdHomes: registerdHomes, pageTitle: 'Airbnb',isLoggedIn: req.isLoggedIn, user: req.session.user, active: "index" });
  });
}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(homes =>{
    if(!homes){
      return res.status(404).render('404', { pageTitle: 'Home Not Found',isLoggedIn: req.isLoggedIn, user: req.session.user, active: ""});
    }
    else{
        res.render('store/home-details', {home:homes , pageTitle: 'home-details' , isLoggedIn: req.isLoggedIn, user: req.session.user, active: ""});
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

