import Store from '../models/Store.js';

export const createStore = async (req, res, next) => {
  try {
    const { name, description, category, phone, email, address, website, socialLinks } = req.body;

    // Check if store already exists for this vendor
    const existingStore = await Store.findOne({ vendor: req.user.id });
    if (existingStore) {
      return res.status(400).json({ success: false, message: 'You already have a store' });
    }

    const store = new Store({
      name,
      description,
      category,
      phone,
      email,
      address,
      website,
      socialLinks,
      vendor: req.user.id,
    });

    await store.save();

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      store,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStores = async (req, res, next) => {
  try {
    const stores = await Store.find().populate('vendor', 'name email');

    res.status(200).json({
      success: true,
      count: stores.length,
      stores,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id).populate('vendor', 'name email');

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStore = async (req, res, next) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    // Check authorization
    if (store.vendor.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this store' });
    }

    store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      store,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    // Check authorization
    if (store.vendor.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this store' });
    }

    await Store.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Store deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ vendor: req.user.id });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
