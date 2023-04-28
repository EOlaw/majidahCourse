const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override'); //Require the method-override module.
//const router = express.Router()



////////////////////////////////
const Course = require('./models/course')
const Subscriber = require("./models/subscriber")
const User = require("./models/user")



////////////////////////////////
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const subscribersController = require('./controllers/subscribersController');
const usersController = require('./controllers/usersController');

//Connection to Mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
//const { reset } = require('nodemon');
mongoose.connect('mongodb+srv://EOlaw146:Olawalee_.146@cluster0.4wv68hn.mongodb.net/majidahCourses?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//Set the view engine to ejs
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));

//Setting the app use
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static(__dirname + 'public/img')) //to load images
app.use(methodOverride("_method", { methods: ["POST", "GET"]})) //Configure the application app to use methodOverride as middleware
//app.use('/', router)



app.use(errorController.logErrors);


//Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
           message: err.message || 'Internal Server Error'
     }
    });
});

app.get('/', (req, res) => {
    res.render('janay')
})
//app.get('/courses', homeController.showCourses)
//app.get('/contact', homeController.showSignUp)
//app.post('/contact', homeController.postedSignUpForm)



//Create subscribersController routes for administrator access
app.get("/subscribers", subscribersController.getAllSubscribers); //Add a route to view all subscribers.
app.get("/contact", subscribersController.getSubscriptionPage); //Add a rpute to view the contact page.
app.post("/subscribe", subscribersController.saveSubscriber); //Add a route to handle posted form data

//Create usersController routes for administrator access
app.get('/users', usersController.index, usersController.indexView);
app.get('/users/new', usersController.new);
app.post('/users/create', usersController.create, usersController.redirectView)
app.get('/users/:id', usersController.show, usersController.showView)
app.get("/users/:id/edit", usersController.edit); //Routes to handle viewing.
app.put("/users/:id/update", usersController.update, usersController.redirectView); //Process data from the edit form, and display the user show page
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

app.listen(4040, () => {
    console.log('Listening on http://localhost:4040')
})