import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//route for category creation
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//route for category update
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//route for all categories
router.get("/get-category", categoryController);

//route for single category
router.get("/single-category/:slug", singleCategoryController);

//route for deleting category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
