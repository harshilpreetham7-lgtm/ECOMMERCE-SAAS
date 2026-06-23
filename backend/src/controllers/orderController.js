import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import { sendOrderConfirmationEmail } from '../utils/email.js';

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get cart
    const cart = await Cart.findOne({ customer: req.user.id }).populate('items.product').populate('items.store');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Group items by store
    const itemsByStore = {};
    for (const item of cart.items) {
      const storeId = item.store._id.toString();
      if (!itemsByStore[storeId]) {
        itemsByStore[storeId] = [];
      }
      itemsByStore[storeId].push(item);
    }

    // Create order for each store
    const orders = [];
    for (const storeId in itemsByStore) {
      const items = itemsByStore[storeId];
      let subtotal = 0;

      for (const item of items) {
        subtotal += item.price * item.quantity;
      }

      const order = new Order({
        customer: req.user.id,
        store: storeId,
        items: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        subtotal,
        tax: 0,
        shippingCost: 0,
        discount: 0,
        total: subtotal,
        paymentMethod,
        shippingAddress,
      });

      await order.save();
      orders.push(order);

      // Update product stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        });
      }

      // Update store stats
      await Store.findByIdAndUpdate(storeId, {
        $inc: { totalOrders: 1, revenue: subtotal },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ customer: req.user.id }, { items: [] });

    // Send confirmation email
    const customer = await Order.findById(orders[0]._id).populate('customer');
    if (customer && customer.customer) {
      sendOrderConfirmationEmail(customer.customer, orders[0]);
    }

    res.status(201).json({
      success: true,
      message: 'Orders created successfully',
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    let query = {};

    if (role === 'customer') {
      query.customer = id;
    } else if (role === 'vendor') {
      const store = await Store.findOne({ vendor: id });
      if (store) {
        query.store = store._id;
      }
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('store', 'name')
      .populate('items.product')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('store', 'name')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    const store = await Store.findById(order.store);
    if (store.vendor.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    let query = {};

    if (role === 'vendor') {
      const store = await Store.findOne({ vendor: id });
      if (store) {
        query.store = store._id;
      }
    }

    const totalOrders = await Order.countDocuments(query);
    const completedOrders = await Order.countDocuments({ ...query, status: 'delivered' });
    const totalRevenue = await Order.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const stats = {
      totalOrders,
      completedOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      conversionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(2) : 0,
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
