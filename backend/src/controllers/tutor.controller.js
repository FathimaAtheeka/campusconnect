const TutorOffer = require("../models/TutorOffer");
const { tutorSchema } = require("../utils/validators");
const { parsePagination, buildPageResult } = require("../utils/pagination");

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.module) filter.moduleCode = req.query.module.toUpperCase();
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.q) filter.$text = { $search: req.query.q };

    const [data, total] = await Promise.all([
      TutorOffer.find(filter).populate("postedBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
      TutorOffer.countDocuments(filter),
    ]);
    res.json(buildPageResult({ data, total, page, limit }));
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const offer = await TutorOffer.findById(req.params.id).populate("postedBy", "name email");
    if (!offer) return res.status(404).json({ error: { message: "Offer not found" } });
    res.json({ offer });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = tutorSchema.parse(req.body);
    const offer = await TutorOffer.create({ ...data, postedBy: req.user._id });
    res.status(201).json({ offer });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const offer = await TutorOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: { message: "Offer not found" } });
    if (String(offer.postedBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: { message: "Not allowed" } });
    }
    const data = tutorSchema.partial().parse(req.body);
    Object.assign(offer, data);
    await offer.save();
    res.json({ offer });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const offer = await TutorOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: { message: "Offer not found" } });
    if (String(offer.postedBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: { message: "Not allowed" } });
    }
    await offer.deleteOne();
    res.json({ message: "Offer deleted" });
  } catch (err) {
    next(err);
  }
};
