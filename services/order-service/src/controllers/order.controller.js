
// import Address from "../address/address.model.js";
import { Order } from "../models/order.model.js";

const createOrder =  async (req, res) => {

    try {

        const userId = req.user.id;

        const { products, total, status, paymentMethod, addressId} = req.body;
        // const shippingAddress = await Address.findOne({
        //     _id: addressId,
        //     userId
        // })

        // if(!shippingAddress) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Address Not found" 
        //     })
        // }

        const order = await Order.create({
            userId,
            products,
            total,
            status,
            payment : {
                method: paymentMethod,
                status: "pending"
            },
            // shippingAddress: shippingAddress._id
            ...(addressId && { shippingAddress: addressId }),


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

