import mongoose, { Document, Schema } from "mongoose";

export interface Book extends Document{
    name:string,
    desc:string,
    author:string,
    category:string,
    price:number,
    image:string,
    file:string,

};

const bookSchema = new Schema({
    name:{ type:String, required:true},
    desc:{type:String, required:true},
    author:{ type:String, required:true},
    category:{ type:String, required:true},
    price:{type:Number},
    image:{ type:String},
    file: {type:String}
});

export default mongoose.model<Book>('Book', bookSchema)