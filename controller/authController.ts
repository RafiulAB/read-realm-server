import { Request, Response } from 'express';
import User, { UserFields } from '../models/User';
import { comparePassword, hashPassword } from '../helpers/authHelper';
import jwt from 'jsonwebtoken';


export const registerController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, address} = req.body;

    // Validation
    if (!name || !email || !password || !address) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists, please login" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await new User({
      name,
      email,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error in registration" });
  }
};

//LOGiN 
export const loginController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({ success: false, message: "Invalid email or password" });
    }

    // Find registered user with email
    const user: UserFields | null = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ success: false, message: "This email is not registered" });
    }

    // Match password
    const match: boolean = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({ success: false, message: "Invalid Password" });
    }

    // Generate token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-default-secret-key', { expiresIn: "7d" });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error in login", error });
  }
};