import express from 'express'
import authMiddleware from "../../shared/middlewares/auth.middleware.js"

const router = express.Router();

router.get("/products", (req, res) => {
    res.json({
        success: true,
        message: "Public Route",
        data: [
            {id:1, name: "Product 1"},
            {id:2, name: "Product 2"},
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