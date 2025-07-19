const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Create a product
router.post("/", productController.createProduct);

// List products
router.get("/", productController.listProducts);

module.exports = router;
