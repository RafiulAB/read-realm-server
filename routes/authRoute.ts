import express, { Request, Response, Router } from "express";
import { loginController, registerController } from "../controller/authController";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware";






const router: Router = express.Router();

//get all books with serach, filter and paginations
router.get('/', requireSignIn, isAdmin, (req: Request, res: Response) => {
    res.send('Hello, auth!!');
  } );

  //register route || method post
router.post("/register", registerController);
router.post("/login", loginController)

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});




export default router;