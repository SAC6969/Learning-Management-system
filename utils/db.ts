import mongoose from "mongoose";
require('dotenv').config();

const dbUrl:string = process.env.DB_URI || '';

const connectDB = async () => {
    try{
        await mongoose.connect(dbUrl).then(()=> {
            console.log("Database connected");
        })
    }catch(e:any){
        console.log(e.message);
        setTimeout(connectDB,5000);
    }
}

export default connectDB;