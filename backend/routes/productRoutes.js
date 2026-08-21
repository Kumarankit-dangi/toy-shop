const express = require("express");
const Product = require("../models/Product");

const router = express.Router();


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const {
    auth,
    adminOnly
} = require("../middleware/authMiddleware");


// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const products = await Product.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load products"
        });

    }

});


// ==========================================
// ADD PRODUCT
// ==========================================

router.post(
    "/",
    auth,
    adminOnly,
    async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            discount,
            category,
            image,
            stock
        } = req.body;


        if (!name || price === undefined || !category) {

            return res.status(400).json({
                success: false,
                message: "Name, price and category are required"
            });

        }


        const product = new Product({

            name,
            description: description || "",
            price: Number(price),
            discount: Number(discount) || 0,
            category,
            image: image || "",
            stock: Number(stock) || 0

        });


        await product.save();


        res.status(201).json({

            success: true,

            message: "Product added successfully",

            product

        });

    } catch (error) {

        console.error("Add Product Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to add product"

        });

    }

});


// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put(
    "/:id",
    auth,
    adminOnly,
    async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            discount,
            category,
            image,
            stock
        } = req.body;


        const product = await Product.findByIdAndUpdate(

            req.params.id,

            {

                name,
                description: description || "",
                price: Number(price),
                discount: Number(discount) || 0,
                category,
                image: image || "",
                stock: Number(stock) || 0

            },

            {
                new: true,
                runValidators: true
            }

        );


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }


        res.json({

            success: true,

            message: "Product updated successfully",

            product

        });

    } catch (error) {

        console.error("Update Product Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to update product"

        });

    }

});


// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete(
    "/:id",
    auth,
    adminOnly,
    async (req, res) => {

    try {

        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }


        res.json({

            success: true,

            message: "Product deleted successfully"

        });

    } catch (error) {

        console.error("Delete Product Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to delete product"

        });

    }

});


module.exports = router;