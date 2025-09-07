const express=require('express');
const session = require('express-session');
const multer = require('multer')
const MongoDbStore= require('connect-mongodb-session')(session);
const db_path='mongodb+srv://root:Sharshdeep91%40@cluster0.oh5gpao.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0';
const store=require('./routes/store');
const host=require('./routes/host');
const auth=require('./routes/auth');
const path=require('path');
const rootDir=require('./utils/pathutils');
const homeController=require('./controllers/error');
const  {default: mongoose} = require('mongoose');
const { ExpressValidator } = require('express-validator');


const app=express();
app.set('view engine', 'ejs');
app.set('views','views');

const cookie_store = new MongoDbStore({
  uri: db_path,
  collection: 'session'
})

const storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null,"uploads/")
  },
  filename: (req,file,cb) =>{
    const safeDate = new Date().toISOString().replace(/:/g, '-');
    cb(null, safeDate + '-' + file.originalname);
  },
})

const fileFilter = (req,file,cb) =>{
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
    cb(null,true);
  }else{
    cb(null,false);
  }
}
const multerContainer = {
  storage,fileFilter
};
// Add middleware to parse form data
app.use(express.urlencoded({ extended: false }));
app.use(multer(multerContainer).single('photo'));
app.use(express.static(path.join(rootDir,"public")));
app.use("/uploads", express.static(path.join(rootDir,'uploads')))
app.use('/host/uploads', express.static(path.join(rootDir,'uploads')))

app.use(session({
  secret: "Harshdeep Singh Airbnb",
  resave: false,
  saveUninitialized: true,
  store: cookie_store,
}))
app.use((req,res,next)=>{
  req.isLoggedIn = req.session.isLoggedIn;
  next();
})

app.use(auth);
app.use(store);

app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    return res.redirect('/login');
  }
});

app.use("/host",host);


app.use(homeController.Page404);


const PORT=5000;

mongoose.connect(db_path).then(()=>{
  console.log('Connected to Mongoose');
  app.listen(PORT,()=>{
    console.log(`The server is running on http://localhost:${PORT}`);
  })
}).catch(err=>{
  console.log('Error while connecting to mongo',err);
})
