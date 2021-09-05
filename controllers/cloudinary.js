const cloudinary = require("cloudinary");

// CLOUDINARY_CLOUD_NAME = laayouni;
// CLOUDINARY_API_KEY = 535113328937146;
// CLOUDINARY_API_SECRET = HrIYUjFaIG1y1HoM1CGO2ryEUAE;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  // console.log(req.body);
  let result = await cloudinary.uploader.upload(req.body.images, {
    public_id: `${Date.now()}`,
    resource_type: "auto", //jpeg,png
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};
exports.remove = async (req, res) => {
  let image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ sucess: false, err });
    res.send("Ok");
  });
};
