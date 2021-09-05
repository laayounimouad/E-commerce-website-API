const Category = require("../models/category");
const slugify = require("slugify");
const Product = require("../models/product");
const Sub = require("../models/sub");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    res.json(await new Category({ name, slug: slugify(name) }).save());
  } catch (err) {
    console.log(err);
    res.status(400).send("create category failed");
  }
};

exports.list = async (req, res) => {
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());
};

exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  // res.json(category);
  const products = await Product.find({ category }).populate("category").exec();

  res.json({
    category,
    products,
  });
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).send("update category failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    console.log(error);
    res.status(400).send("delete category failed");
  }
};

exports.getSubs = (req, res) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }
    res.json(subs);
  });
};
