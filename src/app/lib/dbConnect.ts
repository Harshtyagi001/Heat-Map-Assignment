import mongoose, { Connection } from "mongoose";

interface ConnectionObject {
  isConnected?: number;
}

const connection: ConnectionObject = {};

export const connectToDb = async () => {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const connectInstance = await mongoose.connect(process.env.MONGO_URL || "");
    connection.isConnected = connectInstance.connections[0].readyState;
  } catch (error) {
    console.log("Error connecting to database", error);
    throw new Error("Error while connecting to database");
  }
};


export const connectToChatDb= async() =>{
  try {
    if (connection.isConnected) {
      console.log("Using existing connection to chat database");
      return;
    }
    const connectInstance = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = connectInstance.connections[0].readyState;
  } catch (error) {
    console.log("Error connecting to chat database", error);
    throw new Error("Error while connecting to chat database");
  }
};