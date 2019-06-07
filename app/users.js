const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nanoid = require('nanoid');

const createRouter = () => {
    router.post('/', (req, res) => {
        const user = new User(req.body);

        user.save().then(result => {
            res.send(result);
        }).catch(err => {
            res.status(400).send({message: err});
        })
    });

    router.post('/sessions', async (req, res) => {
        const user = await User.findOne({username: req.body.username});

        if (!user) return res.status(400).send({message: 'User not found'});

        const isMatch = await user.checkPassword(req.body.password);

        if(!isMatch) return res.status(400).send({message: "Wrong password"});

        user.token = nanoid();

        user.save().then((result) => {
            res.send(result);
        });

    });

    router.delete('/sessions', async (req, res) => {
        const token = req.get("Authorization");
        const success = {message: "Logged out!"};
        if (!token) return res.send(success);

        const user = await User.findOne({token});
        if (!user) return res.send(success);

        user.token = nanoid();
        await user.save();
        
        res.send(success);
    });

    return router;
};

module.exports = createRouter;
