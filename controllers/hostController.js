
const Home = require("../models/home");
const fs = require('fs');

exports.getHostHome = (req, res, next) => {
  Home.find().then((registerdHomes) => {
    res.render("host/host-home-list", {
      registerdHomes: registerdHomes,
      pageTitle: "Host Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editMode = req.query.edit === "true";

  Home.findById(homeId).then((homes) => {
    if (!homes) {
      console.log("No Home Found");
      return res.redirect("host/host-home-list");
    }
    res.render("host/edit-home", {
      homeId: homeId,
      home: homes,
      pageTitle: "Edit Home",
      editMode: editMode,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};
exports.postEditHome = (req, res, next) => {
  const { homeId, houseName, price, location, rating, photo, description } =
    req.body;
  Home.findById(homeId).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if(req.file){
      fs.unlink(home.photo, (err)=>{
        if(err){
          console.log('Error while deleting the file',err);
        }
      })
      home.photo=req.file.path;
    }
    home
      .save()
      .then((result) => {
        console.log("Home Updated Successfully", result);
      })
      .catch((err) => {
        console.log("Error in updating home: ", err);
      });
  });
  res.redirect("/host/host-home-list");
};
exports.getAddHome = (req, res, next) => {
  const editMode = false;
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    editMode: editMode,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error in deleting home: ", err);
    });
};
exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log(req.file)
  const photo=req.file.path;
  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  home.save().then(() => {
    console.log("Home save successfully");
  });
  res.redirect("/host/host-home-list");
};
