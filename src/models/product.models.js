const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0,
        },
        category: {
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

module.exports = mongoose.model("Product", productSchema);
