const mongoose = require("mongoose");
const User = mongoose.Schema({
    firstname:{
        type:String,
        required: true,
        min: 3,
        max: 20
    },
    lastname:{
        type:String,
        required: true,
        min: 3,
        max: 20
    },
    email:{
        type:String,
        required: true,
        max: 50,
        unique: true
    },
    password:{
        type:String,
        required: true,
        min: 6
    },
    agreeToTerms:{
        type:Boolean,
        required: true
    }
},{timestamps: true}
);


module.exports = mongoose.model("User",User);