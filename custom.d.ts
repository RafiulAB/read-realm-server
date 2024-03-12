import { UserFields } from "./models/User";

declare global {
    namespace Express {
        interface Request {
            user?: UserFields; // Adjust the import path and User type as necessary
        }
    }
}