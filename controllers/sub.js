const Sub = require("../models/sub");
const slugify = require("slugify");
const Product = require("../models/product");
exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    res.json(await new Sub({ name, parent, slug: slugify(name) }).save());
  } catch (err) {
    console.log(err);
    res.status(400).send("create Sub failed");
  }
};

exports.list = async (req, res) => {
  res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());
};
exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ sub }).populate("category").exec();

  res.json({
    sub,
    products,
  });
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).send("update Sub failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    console.log(error);
    res.status(400).send("delte Sub failed");
  }
};
