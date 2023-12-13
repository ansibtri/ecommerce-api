const Product = require("../models/Product");

// function to generate unique slug for product
const slugsArr = []; // array to store all slugs

// middleware to generate unique slug for product
const slugify = async (req,res,next) =>{
    const productName = req.body.name.replace(/[^a-zA-Z0-9\s]/g, '') // remove special characters from product name
    let slug = productName.toLowerCase().split(' ').join('-'); // convert product name to slug;  like this: word-word-x
    console.log(slug);
    const productSlugs = await Product.find({productSlug:{$regex: slug}}); // search for product with same slug in database
    productSlugs.forEach((product) =>{
        slugsArr.push(product.productSlug);
    })
    if(slugsArr.includes(slug)){
        req.body.productSlug = slug+"-"+slugsArr.length; // if product with same slug exists then add number to slug
    }else{
        req.body.productSlug = slug; // if product with same slug does not exist then use the slug
    }
    slugsArr.length = 0; // empty the array

    next(); // call next middleware
}
module.exports = slugify;


// Features:
// The slugify generates unique slug with product name 

// Problems:
// It doesn't consider unique slug provided by the user.

