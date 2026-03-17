
import { Order } from "./order.model";

const createOrder =  async (req, res) => {

    try {
        
        const userId = req.user.id;
        const { products, total, status} = req.body;

        const order = await Order.create({
            userId,
            products, 
            total, 
            status
        });

        res.status(201).json({
            success: true,
            order: order
        });

    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

const getOrders = async (req, res) => {
    
    try {
        const userId  = req.user.id;
        const order = await Order.find({userId});
        
        res.status(200).json({
            success: true,
            order: order
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export  {
    createOrder,
    getOrders
}