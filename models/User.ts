import mongoose, { Schema } from "mongoose";

export interface UserFields {
  _id:string;
  name: string;
  email: string;
  password: string;
  address?: Record<string, any>; // Assuming address is an object with dynamic keys and values
  role?: string;
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  { _id: {
    type: String,
    required: true,
    trim: true,
  },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }] ,
    role: {
      type: String,
      default:"user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);