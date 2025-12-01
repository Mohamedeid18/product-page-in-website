import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Create order (Client only)
export const createOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ message: 'Each item must have productId and quantity' });
      }

      // Validate productId format before querying DB to avoid server CastError
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: `Invalid productId: ${item.productId}` });
      }

      if (item.quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
      }

      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      status: 'pending',
      stockReserved: true,
      address: address || null,
    });

    await order.save();
    await order.populate('items.product', 'name image');
    
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (Admin gets all, Client gets their own)
export const getAllOrders = async (req, res) => {
  try {
    let orders;
    
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('user', 'name email').populate('items.product', 'name image');
    } else {
      orders = await Order.find({ user: req.user.id }).populate('items.product', 'name image');
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Client can only see their own orders
    if (req.user.role === 'client' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    let { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Valid status is required' });
    // Normalize to lowercase for safe comparisons
    status = status.toString().toLowerCase();
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Normalize stored status for comparisons
    const prevStatus = (order.status || '').toString().toLowerCase();

    // If transitioning from delivered back to pending, do NOT decrement stock again.
    if (status === 'pending' && prevStatus === 'delivered') {
      order.status = status;
      await order.save();
      await order.populate('user', 'name email');
      await order.populate('items.product', 'name image');
      return res.json({ order });
    }

    // If changing status to pending/delivered, reserve stock if not already reserved
    if ((status === 'pending' || status === 'delivered') && !order.stockReserved && !(status === 'pending' && prevStatus === 'delivered')) {
      // attempt to reserve stock for each item
      for (const item of order.items) {
        const productId = item.product?._id || item.product;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: `Product ${productId} not found` });
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
        }
      }

      // all items available, now decrement
      for (const item of order.items) {
        const productId = item.product?._id || item.product;
        const product = await Product.findById(productId);
        product.stock -= item.quantity;
        await product.save();
      }
      order.stockReserved = true;
    }

    // If cancelling order, restore stock only if it was previously reserved
    if (status === 'cancelled' && order.status !== 'cancelled' && order.stockReserved) {
      for (const item of order.items) {
        const productId = item.product?._id || item.product;
        const product = await Product.findById(productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
      order.stockReserved = false;
    }

    order.status = status;
    await order.save();
    
    await order.populate('user', 'name email');
    await order.populate('items.product', 'name image');

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete order (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Authorization: allow admin OR the order owner to delete
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    // If stock was reserved for this order, restore it before deleting
    if (order.stockReserved) {
      for (const item of order.items) {
        const productId = item.product?._id || item.product;
        const product = await Product.findById(productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    await Order.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rate order (Client only, after delivery)
export const rateOrder = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to rate this order' });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate delivered orders' });
    }

    // Check if already rated
    if (order.rating) {
      return res.status(400).json({ message: 'Order already rated' });
    }

    order.rating = rating;
    order.review = review || '';
    order.ratedAt = new Date();
    
    await order.save();
    await order.populate('items.product', 'name image');

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

