const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 8000;
const users = require('./app/users');
const config = require("./config");

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

mongoose.connect(config.db.url + config.db.name, {useNewUrlParser: true})
    .then(() => {
        console.log('Mongoose connected');

        app.use('/users', users());

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT} port`);
        });
    });
