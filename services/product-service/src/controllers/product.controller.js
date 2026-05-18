import { Product } from "../models/product.model.js";

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, message: `Product created by ${req.user.email}`, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: `Product deleted by ${req.user.email}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getAllProducts, createProduct, deleteProduct };
