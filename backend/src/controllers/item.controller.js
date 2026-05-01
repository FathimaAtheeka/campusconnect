const Item = require("../models/Item");
const { itemSchema } = require("../utils/validators");
const { parsePagination, buildPageResult } = require("../utils/pagination");

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.q) filter.$text = { $search: req.query.q };

    const [data, total] = await Promise.all([
      Item.find(filter).populate("postedBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Item.countDocuments(filter),
    ]);
    res.json(buildPageResult({ data, total, page, limit }));
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name email");
    if (!item) return res.status(404).json({ error: { message: "Item not found" } });
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = itemSchema.parse(req.body);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const item = await Item.create({ ...data, imageUrl, postedBy: req.user._id });
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: { message: "Item not found" } });
    if (String(item.postedBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: { message: "Not allowed" } });
    }
    const data = itemSchema.partial().parse(req.body);
    Object.assign(item, data);
    if (req.file) item.imageUrl = `/uploads/${req.file.filename}`;
    await item.save();
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

exports.claim = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "claimed" },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: { message: "Item not found" } });
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: { message: "Item not found" } });
    if (String(item.postedBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: { message: "Not allowed" } });
    }
    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (err) {
    next(err);
  }
};
