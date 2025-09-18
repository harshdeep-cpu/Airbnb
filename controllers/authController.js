const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
  res.render("auth/login" , {pageTitle: 'Login',isLoggedIn:false, errors: [], oldInput:{email: ''}, user: {}, active: ""});
};


exports.postLogin = async (req,res,next)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: {email},
      user:{},
      active: ""
    });
  }
  const match = await bcrypt.compare(password,user.password);
  if(!match){
    return res.status(422).render("auth/login" , {
      pageTitle:"Login",
      isLoggedIn: false,
      errors: ["Invalid password"],
      oldInput: {email},
      user:{},
      active: ""
    })
  }
  req.session.isLoggedIn=true;
  req.session.user=user;
  await req.session.save();
  res.redirect("/");
}

exports.postLogout = (req,res,next)=>{
  req.session.destroy(()=>{
    res.redirect('/login');
  });
}

exports.getSignUp = (req,res,next)=>{
  res.render("auth/signup", {pageTitle:'Sign Up', isLoggedIn: false, errors: [], oldInput: {firstName: "", lastName: "", email: "", password: "", userType: ""}, user: {}, active: ""});
}

exports.postSignUp = [
  check("firstName")
  .trim()
  .isLength({min:2})
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contain only alphabets"),

  check("lastName")
  .matches(/^[A-Za-z\s]*$/)
  .withMessage("Last Name should contain only alphabets"),

  check("email")
  .isEmail()
  .withMessage("Please enter the valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min: 8})
  .withMessage("Password should be atleast 8 character long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain 1 upper case")
  .matches(/[a-z]/)
  .withMessage("Password should contain 1 lower case")
  .matches(/[!@&]/)
  .withMessage("Password should contain 1 special character")
  .trim(),

  check('confirmPassword')
  .trim()
  .custom((value, {req})=>{
    if(value!=req.body.password){
      throw new Error("Re-enter Password do not match");
    }
    return true;
  }),

  check("userType")
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(['user','host'])
  .withMessage("Invalid user type"),

  check("termsAndCondition")
  .notEmpty()
  .withMessage("Please accept the terms and condition")
  .custom((value, {req})=>{
    if(value!=="on"){
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),

  (req,res,next) =>{
    const {firstName, lastName, email, password, userType}= req.body;
    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).render('auth/signup', {
        pageTitle: 'Sign Up',
        isLoggedIn: false,
        errors: errors.array().map(error =>error.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType
        },
        user: {},
        active: ""
      }); 
    }

    bcrypt.hash(password,12).then(hashedPassword =>{
      const user = new User({firstName, lastName, email, password:hashedPassword, userType});
      return user.save();
    })
    .then(()=>{
      res.redirect("/login");
    }).catch(err=>{
      return res.status(400).render('auth/signup', {
        pageTitle: 'Sign Up',
        isLoggedIn: false,
        errors: [err.message],
        oldInput: {
          firstName,
          lastName,
          email,
          userType
        },
        user:{},
        active: ""
      })
    })
}]
