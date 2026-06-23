import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id }).populate('items.product').populate('items.store');

    if (!cart) {
      cart = new Cart({ customer: req.user.id, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, variant } = req.body;

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      cart = new Cart({ customer: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId && item.variant === variant);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        store: product.store,
        quantity,
        variant,
        price: product.price,
      });
    }

    // Recalculate totals
    let subtotal = 0;
    for (const item of cart.items) {
      subtotal += item.price * item.quantity;
    }
    cart.subtotal = subtotal;
    cart.total = subtotal + cart.tax + cart.shippingCost - cart.discount;

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: await cart.populate('items.product').populate('items.store'),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    // Recalculate totals
    let subtotal = 0;
    for (const item of cart.items) {
      subtotal += item.price * item.quantity;
    }
    cart.subtotal = subtotal;
    cart.total = subtotal + cart.tax + cart.shippingCost - cart.discount;

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart: await cart.populate('items.product').populate('items.store'),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    // Recalculate totals
    let subtotal = 0;
    for (const cartItem of cart.items) {
      subtotal += cartItem.price * cartItem.quantity;
    }
    cart.subtotal = subtotal;
    cart.total = subtotal + cart.tax + cart.shippingCost - cart.discount;

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      cart: await cart.populate('items.product').populate('items.store'),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate({ customer: req.user.id }, { items: [] }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
