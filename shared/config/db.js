const connectDB = async (mongoose) =>{
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/atlas';
        console.log("Connecting to:", uri.includes("mongodb+srv") ? "Atlas (cloud)" : "localhost");
        await mongoose.connect(uri);

        console.log("Mongodb is connected");
    } catch(error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;