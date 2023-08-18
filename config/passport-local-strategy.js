const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Employee = require('../models/employee');

// authentication using Passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    async function (email, password, done) {

        try {
            const employee = await Employee.findOne({ email: email });


            if (!employee || employee.password != password) {
                console.log("Invalid Email/Password while sign in");
                return done(null, false);
            }
            return done(null, employee);
        }

        catch (err) {
            if (err) {
                console.log("Error in finding the user --> Passport");
                return done(err);
            }
        }


    }
));

// serializing the user to decide which key is to be kept in cookie
passport.serializeUser(function (employee, done) {
    done(null, employee._id);
});

// deserializing the user from the key in the cookie
passport.deserializeUser(async function (id, done) {
    try {
        const employee = await Employee.findById(id);
        return done(null, employee);
    } catch(err) {
        if (err) {
            console.log("Error in finding user while deserialized");
            return done(err);
        }
    }
});

// made middleware for checking the employee is logged in or not
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/employees/sign_in');
}

// save the user into the locals
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;
