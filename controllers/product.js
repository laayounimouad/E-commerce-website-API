const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    console.log(req.body);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Create a Product failed");
    res.status(400).json({ err: err.message });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("sub")
    .populate("category")
    .sort([["createdAt", "desc"]])
    .exec();
  //populate //to take also the categories informations
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("sub")
    .exec();
  console.log(product);
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR ----> ", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   try {
//     // createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("sub")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// WITH PAGINATION
exports.list = async (req, res) => {
  try {
    // createdAt/updatedAt, desc/asc, 3
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3; // 3

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("sub")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("sub")
    .populate("postedBy")
    .exec();

  res.json(related);
};

// SEARCH / FILTER
//Search/Filer from title
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("sub", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};
//Filter/search by price
const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("sub", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};
//Filter/search by category

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("sub", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

//for sub search

const handleSub = async (req, res, sub) => {
  const products = await Product.find({ sub: sub })
    .populate("category", "_id name")
    .populate("sub", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};
//for shipping filter
const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("sub", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};
//for color filter
const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("sub", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};
//for brand filter
const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("sub", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const { query, price, category, sub, shipping, color, brand } = req.body;

  if (query) {
    console.log("query", query);
    await handleQuery(req, res, query);
  }
  // price [30, 300]

  if (price !== undefined) {
    console.log("price ---> ", price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log("category ---> ", category);
    await handleCategory(req, res, category);
  }

  if (sub) {
    console.log("sub ---> ", sub);
    await handleSub(req, res, sub);
  }

  if (shipping) {
    console.log("shipping ---> ", shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log("color ---> ", color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log("brand ---> ", brand);
    await handleBrand(req, res, brand);
  }
};
