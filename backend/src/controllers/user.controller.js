const User = require("../models/User");
const { roleUpdateSchema } = require("../utils/validators");
const { parsePagination, buildPageResult } = require("../utils/pagination");

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const q = req.query.q ? { name: { $regex: req.query.q, $options: "i" } } : {};
    const [data, total] = await Promise.all([
      User.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(q),
    ]);
    res.json(buildPageResult({ data, total, page, limit }));
  } catch (err) {
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { role } = roleUpdateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: { message: "User not found" } });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: { message: "User not found" } });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
