const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

const createRouter = () => {
    router.get('/', async (req, res) => {
        try {
            const categories = await Category.find();
            res.send(categories);
        } catch (e) {
            res.status(500).send({message: e});
        }
    });

    return router;
};

module.exports = createRouter;
