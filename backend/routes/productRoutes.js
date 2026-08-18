const express = require("express");
const {
  getProducts,
  addProduct,
} = require("../controllers/productController");

const router = express.Router();

// Get All Products
router.get("/", getProducts);

// Add Product
router.post("/", addProduct);

module.exports = router;