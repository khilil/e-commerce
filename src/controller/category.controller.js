import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createCategory = asyncHandler(async (req, res) => {
    const { categoryName, description } = req.body;

    if (!categoryName || !description) {
        throw new ApiError(400, "All fields are required");
    }

    const existing = await Category.find({ categoryName });
    if (!existing) {
        throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({ categoryName, description });

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"));
});
const getAllCategories = asyncHandler(async (req, res) => {
    const category = await Category.find().sort({ name: 1 });

    return res.status(200).json(new ApiResponse(200, category, "Categories fetched successfully"))
})

const deleteCategories = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new ApiError(404, "Category not found")

    return res.status(200)
        .json(new ApiResponse(200, category, "Category deleted successfully"))
})

export { createCategory, getAllCategories, deleteCategories }