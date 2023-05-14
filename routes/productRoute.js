import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryProductsController, createProductController, deleteProductController, getProductController, getSingleProductController, productCountController, productFiltersController, productImageController, productListController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//create product route
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//get products
router.get("/get-product",getProductController);

//get single product
router.get('/get-product/:slug',getSingleProductController);

//get product image
router.get("/product-image/:pid",productImageController);

//delete product
router.delete("/delete-product/:pid",requireSignIn,isAdmin,deleteProductController);

//update product route
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//filter products
router.post("/product-filters",productFiltersController);

//product count
router.get("/product-count",productCountController);

//products per page
router.get("/product-list/:page",productListController);

//search products
router.get("/search/:keyword",searchProductController);

//similar products to the product viewed
router.get("/related-product/:pid/:cid",relatedProductController);

//all products belonging to particular category
router.get("/category-products/:slug", categoryProductsController);

export default router;
