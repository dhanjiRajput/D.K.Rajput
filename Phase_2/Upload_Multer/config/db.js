const mongoose = require('mongoose');

const dbConnection = async () => {
    await mongoose.connect('mongodb://localhost:27017/Image_Upload');
    console.log('Database connected successfully');
};

module.exports = dbConnection;