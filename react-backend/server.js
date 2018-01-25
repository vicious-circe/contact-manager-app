require('./config/config');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');
const validator = require('validator');

const mongoose = require('./db/mongoose');
const {User} = require('./models/user');
const {Contact} = require('./models/contact');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({
    secret:'secret',
    cookie: {maxAge: 360000},
    resave: true,
    saveUninitialized: false
}));

app.get('/', (req, res) => {
    res.send('contact manager app');
});

var isLoggedIn = (req, res, next) => {

    if(req.session.user)
        return next();

    //unauthorized
    res.status(401).send('Please log in.');
};

app.get('/home', isLoggedIn, (req, res) => {

    if(req.session.user) {
        res.send('home page for user');
    } else {
        res.status(401).send('Please log in');
    }
});

app.post('/signup', (req, res) => {

    //if Mongo database is not started
    if(mongoose.connection.readyState !== 1) {
        res.send(`We're sorry. We are having trouble connecting. Try again later`);
        return;
    }
    
    let user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save().then((u) => {
        res.send('Welcome! Please login');
    }).catch((e) => {
        let  error = e.toJSON();
        
        if(error['code'] === 11000) {
            res.send('Email already exists');
        } else if(error.errors.hasOwnProperty('email')) {
            let message = error.errors.email['message'];
            res.send(message);
        } else if(error.errors.hasOwnProperty('password')) {
            let message = error.errors.password['message'];
            res.send(message);
        }
    }); 
});

app.post('/login', (req, res) => {
    if(req.session.user) {
        console.log('redirecting', req.session.user);
        return res.redirect('/home');
    }

    if(!req.body.email || !validator.isEmail(req.body.email)) {
        res.send('Email is not valid');
    }

    if(!req.body.password) {
        res.send('Password is required');
    }

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email}).then((user) => {
        if(!user) {
            res.send(`There is no user associated to this email: ${email}`);
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) {
                    req.session.user = {id:user._id}
                    console.log('user logged in', req.session.user);
                    res.redirect('/home');
                } else {
                    res.send('Incorrect password');
                }
            });
        }
    });
});

app.get('/logout', (req, res) => {
    if(req.session.user) {
        req.session.destroy((err) => {
            if(err) {
                console.log('error logging out');
            } else {
                console.log('logged out');
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
});

app.post('/addContact', isLoggedIn, (req, res) => {
    
    //if Mongo database is not started
    if(mongoose.connection.readyState !== 1) {
        res.send(`We're sorry. We are having trouble connecting. Try again later`);
        return;
    }
    
    var contact = new Contact({
        _userId: req.session.user.id,
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email
    });

    console.log('adding contact from:', req.session.user);

    contact.save().then((c) => {
        console.log('adding');
        res.send(`${contact.name} was added succesfully.`);
    }).catch((e) => {
        res.send(e);
    });

});

// app.post('/searchContacts', isLoggedIn, (req, res) => {

// });

app.delete('/delete/:contactid', isLoggedIn, (req, res) => {
    var contactid = req.params.contactid;
   
    Contact.findOneAndRemove({_id: contactid, _userId: req.session.user.id}).then((contact) => {
        if (!contact) {
            return res.status(404).send();
        }

        res.send(contact);
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

