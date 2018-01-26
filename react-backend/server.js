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
    res.status(200).send('contact manager app');
});

var isLoggedIn = (req, res, next) => {

    console.log(req.session.user);
    if(req.session.user)
        return next();

    //unauthorized
    res.status(401).send('Please, log in.');
};

app.get('/home', isLoggedIn, (req, res) => {
    console.log(req.session.user);
    res.status(200).send('Home page for user');
});

app.post('/signup', (req, res) => {

  if(req.session.user) {
      console.log('redirecting', req.session.user);
      return res.redirect('http://192.168.91.1:3000/');
    }

    console.log('signing up');
    
    //if Mongo database is not started
    if(mongoose.connection.readyState !== 1) {
        res.status(500).send(`We're sorry. We are having trouble connecting. Try again later`);
        return;
    }

    console.log('body', req.body);
    let user = new User({
        email: req.body.email,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        phone: req.body.phone
    });

    user.save().then((u) => {
        res.status(200).send('Welcome! Please login');
    }).catch((e) => {
        let  error = e.toJSON();

        if(error['code'] === 11000) {
            res.status(400).send('Email already exists');
        } else if(error.errors.hasOwnProperty('email')) {
            let message = error.errors.email['message'];
            res.status(400).send(message);
        } else if(error.errors.hasOwnProperty('password')) {
            let message = error.errors.password['message'];
            res.status(400).send(message);
        } else {
            res.status(400).send(`${user} Error occurred ${e}`);
        }
    });
});

app.post('/login', (req, res) => {
    if(req.session.user) {
        console.log('redirecting', req.session.user);
        return res.redirect('http://192.168.91.1:3000/');
    }

    console.log('body login', req.body);

    if(!req.body.email || !validator.isEmail(req.body.email)) {
        res.status(400).send('Email is not valid');
    }

    if(!req.body.password) {
        res.status(400).send('Password is required');
    }

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email}).then((user) => {
        if(!user) {
            res.status(401).send(`There is no user associated to this email: ${email}`);
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) {
                    req.session.user = {id:user._id}
                    req.session.save();
                    console.log('user logged in and redirecting', req.session.user);
                    res.send("good login");
                    //res.redirect('http://192.168.91.1:3000/');
                } else {
                    console.log('incorrect password');
                    res.status(401).send('Incorrect password');
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
                res.send('good logout');
                //res.redirect('http://192.168.91.1:3000/');
            }
        });
    } else {
        res.send('No user was logged in - good logout');
        //res.redirect('http://192.168.91.1:3000/');
    }
});

app.post('/addContact', isLoggedIn, (req, res) => {

    //if Mongo database is not started
    if(mongoose.connection.readyState !== 1) {
        res.status(500).send(`We're sorry. We are having trouble connecting. Try again later`);
        return;
    }

    var contact = new Contact({
        _userId: req.session.user.id,
        fname: req.body.fname,
        lname: req.body.lname,
        phone_number: req.body.phone_number,
        email: req.body.email
    });

    console.log('adding contact from:', req.session.user);

    contact.save().then((c) => {
        let name = contact.fname + ' '+ contact.lname;
        name = name.trim();
        console.log('adding');
        res.send(`${name} was added succesfully.`);
    }).catch((e) => {
        let  error = e.toJSON();

        console.log(error);
        if(error['code'] === 11000) {
            res.status(400).send('Duplicate email. This contact may be already in your contact list');
        } else if(error.errors.hasOwnProperty('fname')) {
            let message = error.errors.fname['message'];
            res.status(400).send(message);
        } else if(error.errors.hasOwnProperty('phone_number')) {
            let message = error.errors.phone_number['message'];
            res.status(400).send(message);
        } else {
            res.status(400).send(`Unable to save contact`);
        }
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

        let name = contact.fname + ' ' + contact.lname;
        console.log(contact);
        res.send(`${name} was deleted`);
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
