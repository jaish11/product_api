const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Create an order
router.post("/", orderController.createOrder);

// Get orders for a user
router.get("/:user_id", orderController.getUserOrders);

module.exports = router;
