import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0,
        },
        categorys: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
        rating: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }],
    },
    { timestamps: true }
);

export const productModel = mongoose.model("Product", productSchema);

