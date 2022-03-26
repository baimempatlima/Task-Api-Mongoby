const { ObjectId } = require("mongodb");
const db = require("../../config/mongodb");
const fs = require("fs");
const path = require("path");

const index = (req, res) => {
  const { search } = req.query;
  if (search) {
    let src = search;
    db.collection("products")
      .find({ name: { $regex: ".*" + src.toLowerCase() + ".*", $options: "i" } })
      .toArray([])
      .then((result) => res.send(result))
      .catch((error) => res.send(error));
  } else {
    db.collection("products")
      .find({})
      .toArray()
      .then((result) => res.send(result))
      .catch((error) => res.send(error));
  }
};

const view = (req, res) => {
  const id = req.params.id;
  db.collection("products").findOne({ _id: ObjectId(id) }, (error, product) => {
    if (error) {
      res.send({ message: "not found", error });
    } else {
      res.send(product);
    }
  });
};

const store = (req, res) => {
  const createProduct = req.body;
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

  db.collection("products").insertOne(createProduct, (error, product) => {
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

  db.collection("products").findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $set: updateData }, { new: true }, (error, product) => {
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


const destroy = (req, res) => {
  const id = req.params.id;
  db.collection("products").deleteOne({ _id: ObjectId(id) }, (error, product) => {
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
  index,
  view,
  store,
  destroy,
  updateData,
};
