require('./config/config');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');

const app = express();
const port = process.env.PORT;
const home_route = require('./routes/home');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', home_route);
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('contact manager app');
});


app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
