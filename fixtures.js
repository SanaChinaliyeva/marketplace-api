const mongoose = require("mongoose");
const config = require("./config");

const Product = require("./models/Product");
const User = require("./models/User");

mongoose.connect(config.getDBPath());

const db = mongoose.connection;

db.once('open', async () => {
    try {
        await db.dropCollection('products');
    } catch (e) {
        console.log("Collections were not present.");
    }

    const [cpuCategory, hddCategory] = await Category.create({
        title: "CPUs",
        description: "Central processor units"
    }, {
        title: "HDD",
        description: "Hard Disk Drives"
    });

    await Product.create({
        name: "Intel Core i7",
        model: "Core i7 8 Gen",
        category: cpuCategory._id,
        price: 700,
        photo: "cpu.jpg"
    }, {
        name: "Seagate 3TB",
        model: "Barracuda",
        category: hddCategory._id,
        price: 200,
        photo: "hdd.jpg"
    });

    await User.create({
        username: "User",
        password: "123"
    }, {
        username: "admin",
        password: "admin"
    });

    db.close();

});
