import { emailHandler } from "./emailHandler.js";
import { paymentHandler } from "./paymentHandler.js";
import { imageHandler } from "./imageHandler.js";

const taskHandlers = {
    'send_email' : async (payload) => {
        await emailHandler(payload)
    },
    'send_payment' : async (payload) => {
        await paymentHandler(payload);
    },
    'resize_image' : async(payload) => {
        await imageHandler(payload)
    }
}

export {
    taskHandlers
}