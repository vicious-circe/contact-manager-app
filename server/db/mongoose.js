const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`connected to database: ${process.env.MONGODB_URI}`);
});

mongoose.connection.on('error', (err) => {
    console.log('failed to connect', process.env.MONGODB_URI);
});

module.exports = mongoose;