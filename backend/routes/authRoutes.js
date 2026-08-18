const express = require("express");
const {
  addProduct,
  getProducts,
} = require("../controllers/productController");

const router = express.Router();

// Get All Products
router.get("/", getProducts);

// Add Product
router.post("/", addProduct);

module.exports = router;