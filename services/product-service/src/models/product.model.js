
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName : {
        type: String,
        required: true,
        minlength: [3, "Product Name should be of 3 Character at least"],
        maxlength: [20, "Maximum Product Name cannot exceed 20"]
    },

    price : {
        type: Number, // paise
        required: true,
        min: 0
    },

    image: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true,
        minlength: [100, "Brief description of minimum 100 characters of the product"],
        maxlength: [500, "Description cannot exceed 500 Characters"]
    },

    category: {
        type: String
    },

    stock: {
        type: Number
    },

}, {
    timestamps: true
})

const Product = mongoose.model("Product", productSchema);
export {
    Product
}