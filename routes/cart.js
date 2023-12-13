const router = require('express').Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// add product to cart
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart(req.body); // create new cart
        const savedCart = await newCart.save(); // save cart to database
        if(!savedCart) return res.status(404).send(JSON.stringify({ "message": "Cart not found" })); // if cart is not saved then send response
        res.status(200).send(JSON.stringify({ "message": "success", "data": savedCart})); // send response
    } catch (errors) {
        res.status(500).json({ "message": "Cart didn't accept product", errors });
    }
});

// delete product from cart
router.delete('/',async(req,res)=>{
    try{
        const deletedProduct = await Cart.deleteOne({_id:req.body.id}); // delete product from cart
        if(!deletedProduct) return res.status(404).send(JSON.stringify({"message":"Product not found"})); // if product is not deleted then send response
        res.status(200).send(JSON.stringify({"message":"success","data":deletedProduct})); // send response
    }catch(errors){
        res.status(500).json({"message":"Product Deletion Failed",errors});
    }
});


// get all products from cart
router.get('/:userId',async(req,res) => {
    try{
        const products = await Cart.find({userId:req.params.userId}); // search products in database
        // if products value is not valid then it will respond with message :"Products not found"
        if(!products) return res.status(404).send(JSON.stringify({"message":"Products not found"}));
        // if products value is valid then it will respond with message :"success" and data:products
        res.status(200).send(JSON.stringify({"message":"success","data":products}));
    }catch(errors){
        res.status(500).json({"message":"Product Fetch Failed",errors});
    
    }
});

// delete all products from cart
router.delete('/all/:userId',async(req,res)=>{
    try{
        const deletedProduct = await Cart.deleteMany(); // delete all products from cart
        if(!deletedProduct) return res.status(404).send(JSON.stringify({"message":"Product not found"})); // if products are not deleted then send response
        res.status(200).send(JSON.stringify({"message":"success","data":deletedProduct})); // send response
    }catch(errors){
        res.status(500).json({"message":"Product Deletion Failed",errors});
    }
})

// update product quantity in cart
router.put('/quantity',async(req,res)=>{
    try{
        const productMaxQuantity = await Product.find({_id:req.body.productId}); // find product in database
        if(productMaxQuantity[0].quantity < req.body.quantity) return res.status(417).json({"message":"Product quantity is not available"})
        const updateQuantity = await Cart.updateOne({_id:req.body.cartId},{$set:{quantity:req.body.quantity}});
        if(!updateQuantity) return res.status(404).send(JSON.stringify({"message":"Product not found"}));
        res.status(200).send(JSON.stringify({"message":"success","data":productMaxQuantity[0].quantity}));
    }catch(errors){
        res.status(500).json({"message":"Product Updation Failed",errors});
    }
});

module.exports = router;