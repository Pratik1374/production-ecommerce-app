import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

//create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {  
    res.status(500).send({
      success: false,
      message: "Error in creating category",
      error,
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {   
    res.status(500).send({
      success: false,
      message: "Error in updating category",
      error
    });
  }
};

//get all categories
export const categoryController = async (req,res) =>{
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message:"All categories list",
            category
        })
    } catch (error) {    
      res.status(500).send({
      success: false,
      message: "Error in getting categories",
      error
    });
    }
}

//get single categories
export const singleCategoryController = async (req,res) =>{
    try {
        const slug = req.params.slug;
        const category = await categoryModel.find({slug});
        res.status(200).send({
            success: true,
            message:"Single category fetching successful",
            category
        })
    } catch (error) {     
      res.status(500).send({
      success: false,
      message: "Error in getting single category",
      error
    });
    }
}

//delete category
export const deleteCategoryController = async (req,res) =>{
    try {
        const {id} = req.params;
        const del = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message:"Category deleted successfully",
        })
    } catch (error) {
      res.status(500).send({
      success: false,
      message: "Error in deleting category",
      error
    });
    }
}