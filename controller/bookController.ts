import { Request, Response } from "express";
import BookModel,{ Book } from "../models/Book";


//get all books
export const getAllBook = async(req:Request,res:Response)=>{
    try {
  // Extract query parameters for filtering
  const { category, search, page } = req.query;

  // Define the filter object based on query parameters
  const filter: { [key: string]: any } = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    // Use a case-insensitive regular expression for partial matching
    filter.name = new RegExp(search as string, 'i');
  }
  const count = await BookModel.countDocuments(filter);

  const size = 8; //items per page
  const pageNumber = page ? parseInt(page as string, 10) : 1;
    
    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * size;
    const pageCount = Math.ceil(count/size);
    
        const books= await BookModel.find(filter)
         .skip(skip)
         .limit(size)
          
        res.status(201).json({
            Pagination:{
                count,pageCount
            },
            books})
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Can not find books' });
    }
}



//get single book
export const getSingleBook =async(req:Request, res:Response)=>{
    const bookId= req.params.id
    try {
        const books = await BookModel.findById(bookId);
        res.status(201).json({books})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:" Book does not found"})
}
}


//create books
export const createBook = async(req:Request, res:Response)=>{
    const {name, author, desc,category,price,image, file} = req.body;
    
    
    try {
        const newBook:Book = await BookModel.create({
            name, author, desc,category, image, price, file
        });
        res.status(201).json(newBook);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error in create books' });
    }
}

//update Books
export const updateBooks =async(req:Request, res:Response)=>{
    const bookId = req.params.id;
    const {name, desc, author, category, image, file}= req.body;
    try {
        const existingBook= await BookModel.findById(bookId);

            if (!existingBook) {
            return res.status(404).json({ error: 'Book not found' });
             }
       //Update fields
       existingBook.name = name || existingBook.name;
       existingBook.desc = desc || existingBook.desc;
       existingBook.author = author || existingBook.author;
       existingBook.category = category || existingBook.category;
       existingBook.image = image || existingBook.image;
       existingBook.file = file || existingBook.file;

      const updatedBook = await existingBook.save();
      res.status(201).json(updatedBook) 

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"book can not update"})
    }
}

//delete books

export const deleteBooks = async(req:Request, res:Response)=>{
    const bookId = req.params.id;
    try {
        const deleteBook = await BookModel.findByIdAndDelete(bookId);
        res.status(201).json({message:"Book deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"error in delete books"})
    }
}