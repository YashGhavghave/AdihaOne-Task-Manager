import mongoose from 'mongoose';

export const DB_Connection = ()=>{
    try{
        mongoose.connect('mongodb://localhost:27017/TaskManager')
    }
    catch(error){
        console.log("Error while connecting to database", error);
    }
}