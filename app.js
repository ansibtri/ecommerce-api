const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const multer = require('multer');
const cookieParser = require("cookie-parser"); // importing cookie parser
const bodyParser = require("body-parser"); // importing body parser
const session = require("express-session"); // importing express session
const connectDB = require("./config/db"); // importing database connection function

const Product = require('./routes/product'); // importing product routes
const Category = require('./routes/category'); // importing category routes
const Cart = require("./routes/cart"); // importing cart routes
const User = require("./routes/user"); // importing user routes
const Auth = require("./routes/auth"); // importing auth routes
dotenv.config(); // for environment variables

connectDB(); // connect to database

app.use(helmet()); // for security
app.use(morgan("common")); // for logging HTTP requests
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
})); // for cross-origin resource sharing

app.use(cookieParser()); // for parsing cookie data
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing JSON data
app.use(session({
    key:"userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: 60*60*24,
    }
}))
app.use('/api/product', Product); // for product routes
app.use('/api/category',  Category); // for category routes
app.use('/api/cart', Cart); // for cart routes
// app.use('/api/user', User)// for user routes
app.use('/api/auth', Auth)// for authentcation routes
// payment
// order
// review


// for uploading images

const PORT = process.env.PORT || 3000; // port number
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})