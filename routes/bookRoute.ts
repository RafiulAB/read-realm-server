import express, { Router } from "express";
import {createBook, deleteBooks, getAllBook, getSingleBook, updateBooks} from "../controller/bookController";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware";

const router: Router = express.Router();

//get all books with serach, filter and paginations
router.get('/get-all',getAllBook);
//all books without paginations
router.get('/:id', getSingleBook)
router.post('/create',requireSignIn, isAdmin,createBook);
router.put('/update/:id',requireSignIn, isAdmin, updateBooks)
router.delete('/delete/:id',requireSignIn, isAdmin, deleteBooks)




export default router;