const mongoose = require('mongoose');
const keys = require('./keys');

mongoose.connect(keys.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('Connected to DB!');
    })
    .catch(err => {
        console.log(err);
    });