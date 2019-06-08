const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const multer = require('multer');
const Product = require('../models/Product');
const path = require('path');
const auth = require('../middlewares/auth');

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

        Product.find().populate('category').populate('seller')
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

    router.post('/', upload.single('photo'), auth, (req, res) => {
        let productData = req.body;

        productData.photo = req.file.filename;
        productData.seller = req.user._id;

        const product = new Product(productData);

        product.save().then(result => {
            res.send(result);
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    router.delete('/:id', auth, async (req, res) => {
        const productId = req.params.id;
        Product.findById(productId).then(product => {
            if (product.seller == req.user._id) {
                product.remove()
                .then(result => res.send(result))
                .catch(err => res.status(500).send(err));
            } else {
                return res.status(403).send({message: "You cannot delete someone's product"});
            }  
        });
              
    });

    return router;
};

module.exports = createRouter;
