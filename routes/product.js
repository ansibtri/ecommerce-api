const router = require('express').Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

const slugify = require('../middlewares/slugify'); // problem exists with unique slug generation
// create a product
router.post('/',slugify,async(req,res)=>{
    // middleware slugify problem is still not solved.
    try{
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(200).send(JSON.stringify({"message":"success","data":savedProduct}))
    }catch(errors){
        res.status(500).json({"message":"Product Addition Failed",errors});
    }
});
// insert many posts
router.post('/many',async(req,res)=>{
    try{
        const newProducts = await Product.insertMany(req.body);
        res.status(200).send(JSON.stringify({"message":"success","data":newProducts}))
    }catch(errors){
        res.status(500).json({"message":"Product Addition Failed",errors});
    }
});
// get all posts
router.get('/',async(req,res)=>{
    try{
        const products = await Product.find({quantity:{$gt:0}}).sort({createdAt: -1}); // search products in database
        // if products value is not valid then it will respond with message :"Products not found"
        if (!products) return res.status(404).send(JSON.stringify({"message":"Products not found"}));
        const categories = await Category.find(); // search categories in database
        if(!categories) return res.status(404).send(JSON.stringify({"message":"Product of categories, you searched, not found"}));
        products.forEach(product => {
            // it will replace categoryId with category name in products array by comparing categoryId with _id of categories array
            product.categoryId = categories.find(category => category._id == product.categoryId).name;
        })
        // if products value is valid then it will respond with message :"success" and data:products

        res.status(200).send(JSON.stringify({"message":"success","data":products}));
    }catch(errors){
        res.status(500).json({"message":"Product Fetch Failed",errors});
    }
});

// get a single product
router.get('/:slug',async(req,res)=>{
    try{
        const product = await Product.findOne({productSlug:req.params.slug});
        // if product value is not valid then it will respond with message :"Product not found"
        if (!product) return res.status(404).send(JSON.stringify({"message":"Product not found"}));

        // if product value is valid then it will respond with message :"success" and data:product
        res.status(200).send(JSON.stringify({"message":"success","data":product}));
    }catch(errors){
        res.status(500).json({"message":"Product Fetch Failed",errors});
    }
});

// delete a product
router.delete('/',async(req,res)=>{
    try{
        // const deletedProduct = await Product.deleteMany();
        // res.status(200).send(JSON.stringify({"message":"success","data":deletedProduct}));
        res.status(200).send(JSON.stringify({"message":"success","data":"Delete Operations is not implemented yet."}));
    }catch(errors){
        res.status(500).json({"message":"Product Deletion Failed",errors});
    }
})
// update a product
router.put("/",async(req,res)=>{
    try{
        const updatedProduct = await Product.updateOne({_id:req.body._id},{$set:req.body});
        if(!updatedProduct) return res.status(404).send(JSON.stringify({"message":"Product not found"}));
        res.status(200).json({"message":"success","data":updatedProduct});
    }catch(errors){
        res.status(500).json({"message":"Product Updation Failed",errors});
    }
});
// get products by category
router.get('/category/:category',async(req,res)=>{
    try{
        const category = await Category.find({slug:req.params.category});
        if(!category) return res.status(404).send(JSON.stringify({"message":"Category not found"}));
        const products = await Product.find({categoryId:category[0]._id});
        if(!products) return res.status(404).send(JSON.stringify({"message":"Products not found"}));
        res.status(200).json({"message":"success","data":products});
    }catch(errors){
        res.status(500).json({"message":"Product Fetch Failed",errors})
    }
})
// get products by search
router.post("/search",async(req,res)=>{
    // console.log(req.params.q);
    try{
        const searchProducts = await Product.find({$text:{$search:req.query.q}}); // search products in database
        if(!searchProducts) return res.status(404).send(JSON.stringify({"message":"Products not found"})); // if products value is not valid then it will respond with message :"Products not found"
        res.status(200).json({"message":"success","data":searchProducts}); // if products value is valid then it will respond with message :"success" and data:products
    }catch(errors){
        res.status(500).json({"message":"Product Fetch Failed",errors})
    }
});
// get products by price range
router.get("/price/:min/:max",async(req,res)=>{
    try{
        const products = await Product.find({price:{$gte:req.params.min,$lte:req.params.max}});
        if(!products) return res.status(404).send(JSON.stringify({"message":"Products not found"}));
        res.status(200).json({"message":"success","data":products});
    }catch(errors){
        res.status(500).json({"message":"Product Fetch Failed",errors})
    }
});


module.exports = router;