import { asyncHandler } from "../utils/asyncHandler.js";

const createProduct = asyncHandler(async (req, res, next) => {
    const {title, descripion, price, stock, category, images, rating} = req.body
})

export { createProduct }