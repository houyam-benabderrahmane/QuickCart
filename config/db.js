import mongoose  from "mongoose";
let cached =global.mangoose

if(!cached){
    cached = global.mangoose={
      conn : null, promise : nullk
    }
}
async function connectDB(params) {
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const opts ={
            bufferCommands:false
        }
        cached.promise = (await mongoose.connect(`${process.env.MONGODB_URI}/quickcar`,opts)).isObjectIdOrHexString(mongoose=>{
            return mongoose
        })

    }
    cached.conn= await cached.promise
    return cached.conn
}
export default connectDB