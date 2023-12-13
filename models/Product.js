const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    categoryId:{
        type: String,
        required: true,
    },
    desc:{
        type:String,
        required: true,
    },
    img:{
        type:Array,
        default: [],
        required: true,
    },
    price:{
        type:Number,
        required: true,
    },
    discount:{
        type:Number,
        default:0,
        required: true,
    },
    inStock:{
        type:Boolean,
        default:true,
        required: true,
    },
    quantity:{
        type:Number,
        required: true,
    },
    rating:{
        type:Number,
        default:0,
        required: true,
    },
    reviews:{
        type:Array,
        default:[],
        required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
        required: true,
    },
    productSlug:{
        type:String,
        required: true,
    }
},
{timestamps:true}
);

module.exports = mongoose.model('Product',ProductSchema);