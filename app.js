const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const authRoutes = require('./routes/AuthRoutes');

const app = express();

//Adding body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//setting up database connection
let dev_db_user = 'mongodb://localhost/samrudhi_enterprises';
const mongoDB = process.env.MONGODB_URI || dev_db_user;

mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(() => console.log("Connection Succesful"))
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

//test endpoint
app.get('/', (req, res) => {
    res.send({
        message: "Welcome"
    });
});

//setup passport and passport-local strategy
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//middleware for express-session
app.use(require('express-session')({
    secret: 'most secure secrete ever',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//passport configuration
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//services
app.use('/api', authRoutes);

//start server
app.listen(process.env.PORT || 5000, () => console.log('Server Started at 5000'));