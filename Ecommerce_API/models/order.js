const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                }
            }
        ],
        amount: { type: Number, required: true }, 
        address: { type: String, required: true }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema); 
