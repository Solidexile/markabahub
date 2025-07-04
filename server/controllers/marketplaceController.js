const MarketplaceItem = require('../models/MarketplaceItem');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// CREATE ITEM
exports.createItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, price, category, images, location, condition } = req.body;
    const item = await MarketplaceItem.create({
      userId: req.user.id,
      title,
      description,
      price,
      category,
      images,
      location,
      condition
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// GET ALL ITEMS
exports.getAllItems = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, location, search, page = 1, limit = 10 } = req.query;
    const where = { status: 'available' };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    const items = await MarketplaceItem.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    });
    const count = await MarketplaceItem.count({ where });
    res.json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE ITEM
exports.getItemById = async (req, res, next) => {
  try {
    const item = await MarketplaceItem.findByPk(req.params.id);
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
    const item = await MarketplaceItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    if (item.userId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await item.update({
      title,
      description,
      price,
      category,
      images,
      location,
      condition,
      status
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// DELETE ITEM
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await MarketplaceItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    if (item.userId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await item.destroy();
    res.json({ msg: 'Item removed' });
  } catch (err) {
    next(err);
  }
};

// GET USER ITEMS
exports.getItemsByUser = async (req, res, next) => {
  try {
    const items = await MarketplaceItem.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};