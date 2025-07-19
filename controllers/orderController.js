const Order = require('../models/Order');
const Product = require('../models/Product');

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;
    
    // Calculate total and validate products
    let total = 0;
    const productDetails = await Promise.all(
      items.map(async item => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        total += product.price * item.qty;
        return product;
      })
    );
    
    const order = new Order({ userId, items, total });
    await order.save();
    
    res.status(201).json({ id: order._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const userId = req.params.user_id;
    
    const orders = await Order.find({ userId })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .populate({
        path: 'items.productId',
        select: 'name price'
      })
      .lean();
    
    const total = await Order.countDocuments({ userId });
    
    const formattedOrders = orders.map(order => ({
      id: order._id,
      items: order.items.map(item => ({
        productDetails: {
          name: item.productId.name,
          id: item.productId._id
        },
        qty: item.qty
      })),
      total: order.total
    }));
    
    res.json({
      data: formattedOrders,
      page: {
        next: parseInt(offset) + parseInt(limit) < total 
          ? parseInt(offset) + parseInt(limit) 
          : null,
        limit: parseInt(limit),
        previous: parseInt(offset) - parseInt(limit) >= 0 
          ? parseInt(offset) - parseInt(limit) 
          : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};