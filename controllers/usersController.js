const User = require('../models/user');

module.exports = {
    index: (req, res, next) => {
        User.find() //Run query in index action only
            .then(users => {
                res.locals.users = users; //Store the user data on the response and call the next middleware function
                next();
            })
            .catch(error => {
                console.log(`Error fetching users: ${error.message}`)
                next(error); //Catch errors, and pass to the next middleware
            });
    },
    indexView: (req, res) => {
        res.render('users/index')
    },
    //Add a new action to render a form
    new: (req, res) => {
        res.render('users/new')
    },
    //Add the create action to save the user to the database
    create: (req, res, next) => {
        let userParams = { //Create users with form parameters.
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        };
        User.create(userParams)
            .then(user => {
                res.redirect('/users');
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error saving user: ${error.message}`);
                next(error);
            })
    },
    //Render the view in a seperate redirectView action
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath)
        else next();
    },
    //Collect the user ID from the request params
    show: (req, res, next) => {
        let userId = req.params.id; //Find a user by its ID
        User.findById(userId)
            .then(user => {
                res.locals.user = user; //Pass the user through the response object to the next middleware function
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by Id: ${error.message}`);
                next(error); //Log and pass errors to next function
            })
    },
    showView: (req, res) => {
        res.render('users/show')
    },
    //Add the edit action
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId) //Use findById to locate a user in the database by their ID.
            .then(user => {
                res.render('users/edit', { //Render the user edit page for a specific user in the database.
                    user: user 
                }); 
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            });
    },
    //Add the update action
    update: (req, res, next) => {
        let userId = req.params.id;
        userParams = { //Collect user parameters from request
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        };
        User.findByIdAndUpdate(userId, { //Use findByIdAndUpdate to locate a user by Id and update the document record in one command.
            $set: userParams
        })
        .then(user => {
            res.redirect = `/users/${userId}`;
            res.locals.user = user;
            next(); //Add user to response as a local variable, and call the next middleware function
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
            next(error);
        })
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        //Deleting a user with the findByIdAndRemove
        User.findByIdAndRemove(userId)
            .then(() => {
                res.redirect('/');
                next();
            })
            .catch(error => {
                console.log(`Error deleting user by ID: ${error.message}`);
                next();
            });
    }
}