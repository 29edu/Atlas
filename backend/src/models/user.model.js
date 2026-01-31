import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [20, "Name cannot exceed 20 characters"]
    },

    email : {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },

    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 Characters"],
        maxlength: [30, "Password cannot exceed 30 Characters"]
    },

}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);
export  {
    User
}