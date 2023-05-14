import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from '../models/categoryModel.js';

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, category, quantity, shipping } =
      req.fields;
    const { image } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case !image:
        return res.status(500).send({ error: "Image is required" });
      case image && image.size > 1048576: //image should not be greater than 1MB
        return res
          .status(500)
          .send({ error: "Image size must be less than 1MB" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-image")
      .limit(10)
      .sort({ createdAt: -1 }); //"-image" means we dont want image from model
    res.status(200).send({
      success: true,
      message: "All products fetched successfully(max 10)",
      noOfProducts: products.length,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting all product",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-image")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting single product",
      error,
    });
  }
};

//get image
export const productImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("image");
    if (product.image.data) {
      res.set("Content-type", product.image.contentType);
      return res.status(200).send(product.image.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting image",
      error,
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    const del = await productModel
      .findOneAndDelete(req.params.pid)
      .select("-image");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, category, quantity, shipping } =
      req.fields;
    const { image } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case image && image.size > 1048576: //image should not be greater than 1MB
        return res
          .status(500)
          .send({ error: "Image size must be less than 1MB" });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating product",
      error,
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong while filtering products",
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting product count",
    });
  }
};

//products list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-image")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    req.status(500).send({
      success: false,
      message: "Error in getting products list",
      error,
    });
  }
};

//search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-image");
    res.json(results);
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
    });
  }
};

//related products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-image")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
    });
  }
};

//category wise all products
export const categoryProductsController = async(req,res) => {
  try {
    const category = await categoryModel.findOne({slug: req.params.slug});
    const products = await productModel.find({category}).populate("category");
    res.status(200).send({
      success: true,
      category,
      products
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      error
    })
  }
}