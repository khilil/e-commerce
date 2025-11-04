import mongoose, { Schema } from "mongoose"

const cartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },

    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
},
    { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);