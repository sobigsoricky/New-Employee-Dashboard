import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable.");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGO_URI, { bufferCommands: false })
            .then((mongooseInstance) => mongooseInstance)
            .catch((error) => {
                console.error("Error connecting to MongoDB:", error);
                throw new Error("Failed to connect to MongoDB");
            });
    }

    try {
        cached.conn = await cached.promise;
        console.log("Connected to MongoDB successfully");
        return cached.conn;
    } catch (error) {
        console.error("Error finalizing MongoDB connection:", error);
        throw new Error("Failed to finalize MongoDB connection");
    }
};

export default connectToDatabase;
