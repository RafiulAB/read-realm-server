import mongoose from "mongoose";

const dbConnect= async ()=>{
    try {
        const conn = await mongoose.connect('mongodb+srv://tonmoy:tonmoy@cluster0.zocf4mt.mongodb.net/?retryWrites=true&w=majority')
        
        console.log("Databse connected successfully")
    } catch (error:any) {
        console.log('error in connecting DB', error)
    }
}
export default dbConnect;