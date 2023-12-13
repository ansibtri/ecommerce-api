const router = require("express").Router();
const Category = require("../models/Category");

// create a category
router.post("/",async(req,res)=>{
    try{
        const newCategory = new Category(req.body); // create a new category
        const savedCategory = await newCategory.save(); // save the category in database
        res.status(200).send(JSON.stringify({"message":"success","data":savedCategory})) // send the response
    }catch(errors){
        // if any error occurs then send the error response
        res.status(500).json({"message":"Category Addition Failed",errors});
    }
});

// get all categories
router.get("/",async(req,res)=>{
    try{
        const categories = await Category.find(); // search categories in database
        // if categories value is not valid then it will respond with message :"Categories not found"
        if (!categories) return res.status(404).send(JSON.stringify({"message":"Categories not found"}));
        res.status(200).json({"message":"success","data":categories}); // send the response
    }catch(errors){
        res.status(500).json({"message":"Category Fetch Failed",errors});
    }
})

// update a category
router.put("/",async(req,res)=>{
    try{
        const updatedCategory = await Category.updateOne({_id:req.body._id,},{$set:req.body});
        res.status(200).json({"message":"success","data":updatedCategory});
    }catch(errors){
        res.status(500).json({"message":"Category Updation Failed",errors});
    }
});
module.exports = router;