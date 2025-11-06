import { Category } from "../models/category.model.js";
import { productModel } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, stock, category, rating } = req.body

    // ✅ validate fields
    if (!title?.trim() || price == null || stock == null) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    // ✅ check duplicates
    const existingProduct = await productModel.findOne({ title });
    if (existingProduct) {
        throw new ApiError(400, "Product already exists");
    }

    // ✅ handle images (Multer + Cloudinary)
    const imagePaths = req.files?.images?.map(f => f.path) || [];
    // console.log(imagePaths);

    if (imagePaths.length === 0) {
        throw new ApiError(400, "Product image is required");
    }

    const uploadedImages = [];

    for (const path of imagePaths) {
        const uploaded = await uploadOnCloudinary(path);
        // console.log(uploaded);

        if (uploaded?.secure_url) uploadedImages.push(uploaded.secure_url);
    }

    // ✅ Handle Category (Important Part)
    let categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
        categoryDoc = await Category.create({ name: category });
    }

    let cleanedPrice = String(price).replace(/[^\d.]/g, "");
    cleanedPrice = parseFloat(cleanedPrice);


    // ✅ create product
    const product = await productModel.create({
        title,
        description,
        price: cleanedPrice,
        stock,
        category: categoryDoc._id,
        images: uploadedImages,
        rating,
    });

    if (!product) {
        throw new ApiError(500, "Something went wrong while creating the product");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));
});

const editProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, stock, category, rating } = req.body;

    // ✅ validate fields
    if (!title?.trim() || price == null || stock == null || description == null) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    const imagePaths = req.files?.images?.map(f => f.path) || [];

    const uploadedImages = [];

    for (const path of imagePaths) {
        const uploaded = await uploadOnCloudinary(path);
        // console.log(uploaded);

        if (uploaded?.secure_url) uploadedImages.push(uploaded.secure_url);
    }

    let cleanedPrice = String(price).replace(/[^\d.]/g, "");
    cleanedPrice = parseFloat(cleanedPrice);

    // console.log(imagePaths);

    const product = await productModel.findByIdAndUpdate(id,
        {
            title,
            description,
            price: cleanedPrice,
            stock,
            images: uploadedImages,
            rating,
        },
        {
            new: true, // return the updated document
            runValidators: true, // validate schema
        }
    );

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product updated successfully"));
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    console.log(id);

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product deleted successfully"))
})




export { createProduct, deleteProduct, editProduct };
