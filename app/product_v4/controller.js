const Product = require("./model");
const fs = require("fs");
const path = require("path");

const store = (req, res) => {
  const createProduct = new Product(req.body);
  const image = req.file;
  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    createProduct.image = {
      image_url: `${req.protocol}://${req.headers.host}/public/${encodeURI(image.originalname)}`,
    };
  } else {
    createProduct.image = {
      image_url: null,
    };
  }

  createProduct.save((error, product) => {
    if (error) {
      res.status(404).send({
        message: "failed",
        error,
      });
    } else {
      res.status(200).send({
        message: "new data added successfully",
        product,
      });
    }
  });
};

const updateData = (req, res) => {
  const updateData = req.body;
  const image = req.file;

  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);

    updateData.image = {
      image_url: `${req.protocol}://${req.headers.host}/public/${encodeURI(image.originalname)}`,
    };
  }

  Product.findOneAndUpdate({ _id: req.params.id }, { $set: updateData }, { new: true }, (error, product) => {
    if (error) {
      res.status(404).send({
        message: "failed",
        error,
      });
    } else {
      res.status(200).send({
        message: "update data successfully updated",
        product,
      });
    }
  });
};

const index = (req, res) => {
  const { search } = req.query;
  if (search) {
    let src = search;
    Product.find({ name: { $regex: ".*" + src.toLowerCase() + ".*", $options: "i" } }, (error, product) => {
      if (error) {
        res.status(404).send({
          message: "not found",
          error,
        });
      } else {
        res.status(200).send({
          product,
        });
      }
    });
  } else {
    Product.find({}, (error, product) => {
      if (error) {
        res.status(404).send({
          message: "not found",
          error,
        });
      } else {
        res.status(200).send({
          product,
        });
      }
    });
  }
};

const view = (req, res) => {
  const id = req.params.id;
  Product.findById({ _id: id }, (error, product) => {
    if (error) {
      res.status(404).send({
        message: "not found",
        error,
      });
    } else {
      res.status(200).send({
        product,
      });
    }
  });
};

const destroy = (req, res) => {
  const id = req.params.id;
  Product.deleteOne({ _id: id }, (error, product) => {
    if (error) {
      res.status(404).send({
        message: "failed",
        error,
      });
    } else {
      res.status(200).send({
        message: "data deleted successfully",
        product,
      });
    }
  });
};

module.exports = {
  store,
  updateData,
  index,
  view,
  destroy,
};
