const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected')
        console.log(`Connection Host: ${conn.connection.host}`);
        console.log("Connection Name: "+ conn.connection.name);
        console.log(`Connection Port: ${conn.connection.port}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;