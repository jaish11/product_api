const Product = require("../models/Product");

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ id: product._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// List products with filtering
exports.listProducts = async (req, res) => {
  try {
    const { name, size, limit = 10, offset = 0 } = req.query;

    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (size) query["sizes.size"] = size;

    const products = await Product.find(query)
      .select("_id name price")
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      data: products.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
      })),
      page: {
        next:
          parseInt(offset) + parseInt(limit) < total
            ? parseInt(offset) + parseInt(limit)
            : null,
        limit: parseInt(limit),
        previous:
          parseInt(offset) - parseInt(limit) >= 0
            ? parseInt(offset) - parseInt(limit)
            : null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
