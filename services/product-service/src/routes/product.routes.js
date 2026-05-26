import express from 'express'
import authMiddleware from "../../../../shared/middlewares/auth.middleware.js"

const router = express.Router();

router.get("/products", (req, res) => {
    res.json({
        success: true,
        data: [
            {
                _id: "507f1f77bcf86cd799439011",
                productName: "Wireless Headphones",
                description: "Premium noise-cancelling wireless headphones with 30hr battery life.",
                price: 2999,
                category: "Electronics",
                stock: 15,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop",
            },
            {
                _id: "507f1f77bcf86cd799439012",
                productName: "Running Shoes",
                description: "Lightweight breathable shoes built for long-distance running.",
                price: 1499,
                category: "Footwear",
                stock: 30,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop",
            },
            {
                _id: "507f1f77bcf86cd799439013",
                productName: "Mechanical Keyboard",
                description: "TKL mechanical keyboard with RGB backlighting and blue switches.",
                price: 3499,
                category: "Electronics",
                stock: 8,
                image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=200&fit=crop",
            },
            {
                _id: "507f1f77bcf86cd799439014",
                productName: "Cotton T-Shirt",
                description: "100% organic cotton oversized t-shirt, available in multiple colors.",
                price: 499,
                category: "Clothing",
                stock: 50,
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=200&fit=crop",
            },
            {
                _id: "507f1f77bcf86cd799439015",
                productName: "Stainless Steel Bottle",
                description: "Double-walled insulated bottle, keeps drinks cold for 24hrs.",
                price: 799,
                category: "Lifestyle",
                stock: 25,
                image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=200&fit=crop",
            },
            {
                _id: "507f1f77bcf86cd799439016",
                productName: "Desk Lamp",
                description: "LED desk lamp with adjustable brightness and USB charging port.",
                price: 1199,
                category: "Home",
                stock: 12,
                image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=200&fit=crop",
            },
        ],
    });
})

router.post("/products", authMiddleware, (req, res) => {
    console.log("User creating Products", req.user);

    res.json({
        success: true,
        message: 'Product created by user ${req.user.email}',
        data: {
            createdBy: req.user.id,
            product: req.body,
        },
    });
});

// Protected Route - Need tokrn
router.delete("/poducts/:id", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: `Product deleted by User ${req.user.email}`,
    });
})



export default router;