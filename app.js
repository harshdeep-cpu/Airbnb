const express=require('express');
const user=require('./routes/user');
const {host}=require('./routes/host');
const path=require('path');
const rootDir=require('./utils/pathutils');
const homeController=require('./controllers/error');

const app=express();
app.set('view engine', 'ejs');
app.set('views','views');
app.use(user);
app.use(host);

app.use(express.static(path.join(rootDir,"public")));

app.use(homeController.Page404);






const PORT=3000;

app.listen(PORT,()=>{
  console.log(`The server is running on http://localhost:${PORT}`);
});