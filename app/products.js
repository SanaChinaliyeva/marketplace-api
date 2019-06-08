const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const multer = require('multer');
const Product = require('../models/Product');
const Category = require('../models/Category');
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
        if (req.query.category) {
            Category.find({title: req.query.category}).then(cat => {
                Product.find({category: cat[0]._id})
                .populate('category').populate('seller')
                .then(result => {
                    res.send(result);
                }).catch(() => {
                    res.status(500).send('Internal server error');
                });
            })
        } else {
            Product.find().populate('category').populate('seller')
            .then(result => {
            res.send(result);
            }).catch(() => {
                res.status(500).send('Internal server error');
            });
        }
    });
    router.get('/:id', (req, res) => {
        Product.findById(req.params.id)
            .populate('category').populate('seller')
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
        Category.find({title: productData.category}).then(category => {
            productData.category = category[0]._id;
            if (!productData.name 
                || !productData.description 
                || !productData.photo 
                || !productData.price 
                || !productData.category 
                || !productData.seller) {
                    res.status(400).send({message: "All fields are required"});
            } else {
                const product = new Product(productData);
    
                product.save().then(result => {
                    res.send(result);
                }).catch((error) => {
                    res.status(400).send(error);
                });
            }
        });
    });

    router.delete('/:id', auth, (req, res) => {
        const productId = req.params.id;
        Product.findById(productId)
        .populate('seller')
        .then(product => {
            if (req.user._id.toString() === product.seller._id.toString()) {
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
