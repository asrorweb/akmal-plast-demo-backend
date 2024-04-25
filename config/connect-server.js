import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_LINK);
    console.log(" 💿  Connected to database");
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
};

export default connectToDatabase;
