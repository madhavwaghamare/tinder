const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://root:root@namastedev.ivzqt.mongodb.net/devTinder");
}

module.exports = connectDB;
