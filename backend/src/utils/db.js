import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error("Error in DB connection", error);
        process.exit(1);
    }
};

export default connectDB;