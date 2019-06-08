const mongoose = require("mongoose");
const config = require("./config");

const Product = require("./models/Product");
const Category = require("./models/Category");
const User = require("./models/User");

mongoose.connect(config.getDBPath());

const db = mongoose.connection;

db.once('open', async () => {
    try {
        await db.dropCollection('products');
        await db.dropCollection('users');
        await db.dropCollection('categories');
    } catch (e) {
        console.log("Collections were not present.");
    }

    const [user, admin] = await User.create({
        username: "User",
        password: "123",
        display_name: "Sana Chinaliyeva",
        phone: "+7 777 777 77 77"
    }, {
        username: "admin",
        password: "admin",
        display_name: "Admin",
        phone: "+7 777 777 77 88"
    });

    const [cpuCategory, hddCategory, shoesCategory, clothesCategory] = await Category.create({
        title: "CPUs",
    }, {
        title: "HDD",
    }, {
        title: "Shoes",
    }, {
        title: "Clothes",
    });

    await Product.create({
        name: "Intel Core i7",
        description: "Core i7 8 Gen",
        category: cpuCategory._id,
        price: 20000,
        photo: "cpu.png",
        seller: user._id
    }, {
        name: "Seagate 3TB",
        description: "Barracuda",
        category: hddCategory._id,
        price: 12000,
        photo: "hdd.jpg",
        seller: admin._id
    }, {
        name: "Red Jimmy Choo trainers",
        description: "Almost new",
        category: shoesCategory._id,
        price: 700000,
        photo: "shoes.jpg",
        seller: user._id
    }, {
        name: "White Sherri Hill dress",
        description: "Dress for prom",
        category: clothesCategory._id,
        price: 130000,
        photo: "dress.jpg",
        seller: admin._id
    });

    

    db.close();

});
