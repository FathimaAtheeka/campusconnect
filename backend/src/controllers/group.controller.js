const StudyGroup = require("../models/StudyGroup");
const { groupSchema } = require("../utils/validators");
const { parsePagination, buildPageResult } = require("../utils/pagination");

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.module) filter.moduleCode = req.query.module.toUpperCase();
    if (req.query.q) filter.$text = { $search: req.query.q };

    const [data, total] = await Promise.all([
      StudyGroup.find(filter)
        .populate("createdBy", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      StudyGroup.countDocuments(filter),
    ]);
    res.json(buildPageResult({ data, total, page, limit }));
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");
    if (!group) return res.status(404).json({ error: { message: "Group not found" } });
    res.json({ group });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = groupSchema.parse(req.body);
    const group = await StudyGroup.create({
      ...data,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json({ group });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ error: { message: "Group not found" } });
    if (String(group.createdBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: { message: "Not allowed" } });
    }
    const data = groupSchema.partial().parse(req.body);
    Object.assign(group, data);
    await group.save();
    res.json({ group });
  } catch (err) {
    next(err);
  }
};

exports.join = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ error: { message: "Group not found" } });
    if (group.members.length >= group.capacity) {
      return res.status(400).json({ error: { message: "Group is full" } });
    }
    if (group.members.some((m) => String(m) === String(req.user._id))) {
      return res.status(400).json({ error: { message: "Already a member" } });
    }
    group.members.push(req.user._id);
    await group.save();
    res.json({ group });
  } catch (err) {
    next(err);
  }
};

exports.leave = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ error: { message: "Group not found" } });
    group.members = group.members.filter((m) => String(m) !== String(req.user._id));
    await group.save();
    res.json({ group });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ error: { message: "Group not found" } });
    if (String(group.createdBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: { message: "Not allowed" } });
    }
    await group.deleteOne();
    res.json({ message: "Group deleted" });
  } catch (err) {
    next(err);
  }
};
