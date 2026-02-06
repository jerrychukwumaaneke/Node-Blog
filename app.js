require('dotenv').config();

const express=require('express');
const expressLayout=require('express-ejs-layouts');

// we introduce the method override before we can make use of the edit and delete in our code 
const methodOverride=require('method-override');
// this is the cookie parser that will help us to grab and save cookies 
// it will also help us to store a session when we log in
const cookieParser= require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');



const connectDB=require('./server/config/db')
 
// this is for the active link pages which we created in the helpers file
const {isActiveRoute}=require('./server/helpers/routerHelpers');


const app=express();
const PORT=5000 || process.env.PORT;


//connect to DB
connectDB();

//this is for the search. to be able to pass, search and get data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// this is for the cookie parser been passed as a middleware
app.use(cookieParser());
app.use(session({
  secret: 'Keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
  // It is good practice to add a cookie expiration
}));

app.use(methodOverride('_method'))
app.use(express.static('public'));


app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//creating a global variablr for the active link call made above in this file
app.locals.isActiveRoute=isActiveRoute;

app.use('/', require('./server/route/main'));
app.use('/', require('./server/route/admin'));

app.listen(PORT, ()=>{
    console.log('App listening on port 5000')
})