const mongoose = require('mongoose');

const url = "mongodb+srv://Alan123:Alan123@fscluster-15amg.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = mongoose.connect(url, { 
        useNewUrlParser: true, useUnifiedTopology: true
    }).then(() =>{
    console.log('mDB Atlas connected..!');
    });

module.exports = connectDB;