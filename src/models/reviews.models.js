import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema)