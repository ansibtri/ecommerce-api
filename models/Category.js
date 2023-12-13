const mongoose = require("mongoose");
const Category = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    slug:{
        type:String,
        required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
        required: true,
    }
},
{timestamps:true}
);

module.exports = mongoose.model("Category",Category);