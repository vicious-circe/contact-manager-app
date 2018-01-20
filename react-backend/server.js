require('./config/config');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');

const mongoose = require('./db/mongoose');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT;
const home_route = require('./routes/home');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', home_route);
app.use(bodyParser.json());
app.use(session({
    secret:'secret',
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: false
}));

app.get('/', (req, res) => {
    res.send('contact manager app');
});

app.post('/signup', (req, res) => {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save().then((u) => {
        res.send(u);
    });
});

app.post('/login', (req, res) => {
    if(req.session.user) {
        console.log('redirecting', req.session.user);
        return res.redirect('/users/home');
    }
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email}).then((user) => {
        if(!user) {
            res.send('user does not exist');
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) {
                    req.session.user = {id:user._id}
                    console.log('user logged in', req.session.user);
                    res.redirect('/users/home');
                } else {
                    res.send('incorrect password', req.session.user);
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
    } 
});

app.post('/addContact', (req, res) => {

});

app.post('/searchContacts', (req, res) => {

});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
