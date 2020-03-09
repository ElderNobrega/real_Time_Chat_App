const mongoose = require('mongoose');

const URI = "mongodb+srv://Alan123:Alan123@fscluster-15amg.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async() => {
    await mongoose.connect(URI, { 
        useNewUrlParser: true, useUnifiedTopology: true
    });
    console.log('mDB Atlas connected..!');
};

module.exports = connectDB;