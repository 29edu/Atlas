
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    country: String,

    fullName: String,

    mobileNumber: String,
    
    pincode: String,

    flat: String,

    street: String,

    landMark: String,

    city: String, 

    state: String,
})

const Address = new mongoose.model("Address", addressSchema);

export default Address;