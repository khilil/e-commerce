import { Category } from "../models/category.model.js";
import { productModel } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, stock, categorys, rating } = req.body

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
    const categoryDoc = await Category.findOne({ categoryName: categorys });
    console.log(categoryDoc);
    
    if (!categoryDoc) {
        throw new ApiError(404, `Category not found`);
    }


    let cleanedPrice = String(price).replace(/[^\d.]/g, "");
    cleanedPrice = parseFloat(cleanedPrice);


    // ✅ create product
    const product = await productModel.create({
        title,
        description,
        price: cleanedPrice,
        stock,
        categorys: categoryDoc._id,
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
    const { title, description, price, stock, categorys, rating } = req.body;

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

const getAllProducts = asyncHandler(async (req, res) => {
    const { search, categorys, minPrice, maxPrice, page, limit = 10 } = req.query

    const query = {};

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
        query.price = {};

        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);

    }

    if (categorys) {
        const categoryDoc = await Category.findOne({
            categoryName: { $regex: categorys, $options: "i" } // case-insensitive match
        });
        if (categoryDoc) query.category = categoryDoc._id;
    }


    const skip = (page - 1) * limit;

    const products = await productModel
        .find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await productModel.countDocuments(query);

    console.log(query);


    return res.status(200).json(
        new ApiResponse(200,
            {
                products,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
            })
    )
})

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await productModel.findById(id).populate("category", "categoryName")

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    return res.status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"))
})





export { createProduct, deleteProduct, editProduct, getAllProducts, getProductById };
