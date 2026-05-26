import mongoose from "mongoose"

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI || 'http://localhost:27017/atlas');
        console.log("Mongodb is connected to local Server");
    } catch(error) {
        console.error(`Some error is found in the mongodb ${error}`)
    }
}

export default connectDB;