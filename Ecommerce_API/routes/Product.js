const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { verifyTokenAndAdmin } = require("../routes/Verify_token");

/// CREATE a new product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        // Save the new product to the database
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        // Log the full error for debugging
        console.error('Error creating product:', err);

        // Respond with a more detailed error message
        res.status(500).json({
            error: 'Failed to create product',
            details: err.message
        });
    }
});

// UPDATE a product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// DELETE a product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// GET a product by ID
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// GET all products
router.get("/", async (req, res) => {
    
    const qNew = req.query.new;
    const qCategory = req.query.category;
    
    try {
        let products;

        if (qNew) {
           
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
           
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// GET product statistics (e.g., count of products, products by category)
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    try {
        // Example 1: Count of all products
        const totalProducts = await Product.countDocuments();

        // Example 2: Count of products added in the last month
        const date = new Date();
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

        const productsLastMonth = await Product.countDocuments({
            createdAt: { $gte: lastMonth }
        });

        // Example 3: Breakdown of products by category
        const productCategories = await Product.aggregate([
            { $unwind: "$categories" },
            { $group: { _id: "$categories", count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            totalProducts,
            productsLastMonth,
            productCategories
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;
