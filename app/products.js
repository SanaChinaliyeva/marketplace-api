const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const multer = require('multer');
const Product = require('../models/Product');
const path = require('path');

const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const createRouter = () => {

    router.get('/', async (req, res) => {

        Product.find().populate('category')
            .then(result => {
            res.send(result);
        }).catch(() => {
            res.status(500).send('Internal server error');
        });
    });

    router.get('/:id', (req, res) => {
        Product.findById(req.params.id)
            .then(result => {
                if (result) res.send(result);
                else res.sendStatus(404);
            })
            .catch(() => {
                res.sendStatus(500);
            });
    });

    router.post('/', upload.single('photo'), (req, res) => {
        let productData = req.body;

        if (req.file) {
            productData.photo = req.file.filename;
        }

        const product = new Product(productData);

        product.save().then(result => {
            res.send(result);
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    return router;
};

module.exports = createRouter;
