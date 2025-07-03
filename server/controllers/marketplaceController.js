const MarketplaceItem = require('../models/MarketplaceItem');
const { validationResult } = require('express-validator');

// CREATE ITEM
exports.createItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, price, category, images, location, condition } = req.body;
    
    const newItem = new MarketplaceItem({
      user: req.user.id,
      title,
      description,
      price,
      category,
      images,
      location,
      condition
    });

    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// GET ALL ITEMS
exports.getAllItems = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, location, search, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'available' };
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (location) query.location = new RegExp(location, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const items = await MarketplaceItem.find(query)
      .populate('user', 'name avatar rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const count = await MarketplaceItem.countDocuments(query);
      
    res.json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE ITEM
exports.getItemById = async (req, res, next) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id)
      .populate('user', 'name avatar phone rating createdAt');
      
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// UPDATE ITEM
exports.updateItem = async (req, res, next) => {
  try {
    const { title, description, price, category, images, location, condition, status } = req.body;
    
    let item = await MarketplaceItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    item = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        price, 
        category, 
        images, 
        location, 
        condition, 
        status,
        updatedAt: Date.now() 
      },
      { new: true }
    );
    
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// DELETE ITEM
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await item.deleteOne();
    
    res.json({ msg: 'Item removed' });
  } catch (err) {
    next(err);
  }
};

// GET USER ITEMS
exports.getItemsByUser = async (req, res, next) => {
  try {
    const items = await MarketplaceItem.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
      
    res.json(items);
  } catch (err) {
    next(err);
  }
};