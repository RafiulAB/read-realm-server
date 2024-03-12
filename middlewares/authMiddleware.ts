import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';


interface UserFields {
  _id: string;
  name: string;
  email: string;
  password: string;
  address:string
  // Add more properties as needed
}
interface CustomRequest extends Request {
  user?:any};

export const requireSignIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Unauthorized: Token missin in header' });
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: Token missing in spilt' });
      }
        console.log(token)
        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { [key: string]: any };
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

//check admin
export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
      const user = await User.findById(req.user._id);

      if (!user) {
          return res.status(404).send({
              success: false,
              message: "User not found"
          });
      }

      if (user.role !== 'admin') {
          return res.status(401).send({
              success: false,
              message: "Unauthorized Access"
          });
      } else {
          next();
      }
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          error,
          message: "Error in admin access"
      });
  }
};
